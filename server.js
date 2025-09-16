const express = require('express');
const path = require('path');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// 虎皮椒配置 - 从环境变量读取
const xunhuConfig = {
    appId: process.env.XUNHUPAY_APP_ID || '2019061738479',
    appSecret: process.env.XUNHUPAY_SECRET || 'dc385b31f51cf922a51b4c28a370662',
    gateway: 'https://api.xunhupay.com/payment/do.html',
    notifyUrl: process.env.BASE_URL ? `${process.env.BASE_URL}/api/payment/notify` : `https://yourapp.onrender.com/api/payment/notify`
};

// 生成MD5签名
function getHash(params, appSecret) {
    const sortedParams = Object.keys(params)
        .filter(key => params[key] && key !== 'hash')
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    const stringSignTemp = sortedParams + appSecret;
    const hash = crypto.createHash('md5').update(stringSignTemp).digest('hex');
    return hash;
}

// 生成随机字符串
function generateNonceStr() {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

// 获取当前时间戳
function nowDate() {
    return Math.floor(new Date().valueOf() / 1000);
}

// 支付服务映射
const serviceConfig = {
    'annual-accounting': { name: '年代账服务', price: 999 },
    'annual-report': { name: '年申报服务', price: 178 },
    'license-cancel': { name: '营业执照注销服务', price: 599 }
};

// 创建支付订单API
app.post('/api/payment/create', async (req, res) => {
    try {
        const { serviceType, orderId } = req.body;
        
        if (!serviceType || !orderId) {
            return res.status(400).json({ error: '参数不完整' });
        }

        const service = serviceConfig[serviceType];
        if (!service) {
            return res.status(400).json({ error: '不支持的服务类型' });
        }

        const params = {
            version: '1.1',
            appid: xunhuConfig.appId,
            trade_order_id: orderId,
            total_fee: service.price,
            title: service.name,
            time: nowDate(),
            notify_url: xunhuConfig.notifyUrl,
            nonce_str: generateNonceStr(),
            type: 'WAP',
            wap_url: process.env.BASE_URL || 'https://yourapp.onrender.com',
            wap_name: '注册公司服务平台',
        };

        const hash = getHash(params, xunhuConfig.appSecret);

        // 发送支付请求
        const requestParams = new URLSearchParams({
            ...params,
            hash,
        });

        const response = await axios.post(xunhuConfig.gateway, requestParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log('虎皮椒支付响应:', response.data);

        if (response.data && response.data.url) {
            res.json({
                success: true,
                payment_url: response.data.url,
                orderId: orderId
            });
        } else {
            res.json({
                success: false,
                error: response.data.error || '支付接口调用失败'
            });
        }

    } catch (error) {
        console.error('虎皮椒支付下单失败:', error);
        res.status(500).json({ error: '系统错误: ' + error.message });
    }
});

// 支付回调接口
app.post('/api/payment/notify', async (req, res) => {
    try {
        const data = req.body || {};
        const appSecret = xunhuConfig.appSecret;
        
        console.log('收到虎皮椒回调:', data);

        // 验签
        if (data.hash !== getHash(data, appSecret)) {
            console.log('虎皮椒回调验签失败');
            res.send('fail');
            return;
        }

        if (data.status === 'OD') {
            console.log('支付成功, 订单号:', data.trade_order_id);
            // 这里可以更新数据库订单状态为已支付
            // 处理业务逻辑
            
            res.send('success');
        } else {
            console.log('支付未成功, 状态:', data.status);
            res.send('success'); // 即使未成功也要返回success给虎皮椒
        }

    } catch (error) {
        console.error('虎皮椒回调处理失败:', error);
        res.send('fail');
    }
});

// 提供静态文件服务
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`虎皮椒配置: APPID=${xunhuConfig.appId}`);
});