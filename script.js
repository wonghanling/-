// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initPage();
    
    // 设置表单提交事件
    setupForm();
    
    // 设置滚动动画
    setupScrollAnimations();
    
    // 设置导航平滑滚动
    setupSmoothScroll();
});

// 页面初始化
function initPage() {
    // 添加滚动时的导航栏效果
    window.addEventListener('scroll', handleScroll);
    
    // 设置模态框关闭事件
    setupModal();
}

// 处理滚动事件
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
}

// 设置表单提交
function setupForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        // 表单现在直接提交到Getform，不需要JavaScript处理
        form.addEventListener('submit', function(e) {
            // 简单的客户端验证
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            
            if (!name || name.trim() === '') {
                e.preventDefault();
                alert('请输入您的姓名！');
                return;
            }
            
            if (!validatePhone(phone)) {
                e.preventDefault();
                alert('请输入正确的手机号码！');
                return;
            }
            
            // 让表单正常提交到Getform
        });
    }
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        timestamp: new Date().toISOString() // 使用ISO标准时间格式
    };
    
    // 验证姓名
    if (!data.name || data.name.trim() === '') {
        alert('请输入您的姓名！');
        return;
    }
    
    // 验证手机号
    if (!validatePhone(data.phone)) {
        alert('请输入正确的手机号码！');
        return;
    }
    
    // 保存数据
    saveFormData(data);
    
    // 显示成功提示
    showSuccessModal();
    
    // 重置表单
    e.target.reset();
}

// 验证手机号
function validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// 保存表单数据（本地存储）
function saveFormData(data) {
    // 获取现有数据
    let existingData = JSON.parse(localStorage.getItem('user_inquiries') || '[]');
    
    // 添加到数组
    existingData.push(data);
    
    // 保存到本地存储
    localStorage.setItem('user_inquiries', JSON.stringify(existingData));
    
    // 输出到控制台
    console.log('新用户咨询：', data);
    console.log('所有咨询记录：', existingData);
}

// 显示成功弹窗
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    // 添加淡入动画
    setTimeout(() => {
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// 显示登录弹窗
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
    
    // 添加淡入动画
    setTimeout(() => {
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
    
    // 聚焦到密码输入框
    setTimeout(() => {
        document.getElementById('adminPassword').focus();
    }, 100);
}

// 关闭登录弹窗
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

// 登录验证
function login() {
    const password = document.getElementById('adminPassword').value;
    
    // 设置管理密码为 "admin123"
    if (password === 'admin123') {
        // 登录成功，跳转到管理页面
        window.location.href = 'admin.html';
    } else {
        alert('密码错误！');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

// 设置模态框
function setupModal() {
    const successModal = document.getElementById('successModal');
    const loginModal = document.getElementById('loginModal');
    
    // 成功弹窗设置
    const successCloseBtn = successModal.querySelector('.close');
    successCloseBtn.addEventListener('click', closeModal);
    
    // 登录弹窗设置
    const loginCloseBtn = loginModal.querySelector('.close');
    loginCloseBtn.addEventListener('click', closeLoginModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === successModal) {
            closeModal();
        }
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (successModal.style.display === 'block') {
                closeModal();
            }
            if (loginModal.style.display === 'block') {
                closeLoginModal();
            }
        }
    });
    
    // 登录弹窗回车键提交
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && loginModal.style.display === 'block') {
            login();
        }
    });
}

// 滚动到表单
function scrollToForm() {
    const contactSection = document.getElementById('contact');
    contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 设置平滑滚动
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 设置滚动动画
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.service-card, .advantage-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// 添加输入框焦点效果
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});

// 添加服务卡片悬停效果
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// 添加加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后的额外动画
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 初始化页面时设置body透明度
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// 导出全局函数供HTML调用
window.scrollToForm = scrollToForm;
window.closeModal = closeModal;
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.login = login;
window.selectService = selectService;
window.closePaymentModal = closePaymentModal;
window.proceedToPayment = proceedToPayment;

// 支付相关功能
let selectedServiceData = {};

// 选择服务
function selectService(serviceType, price, serviceName) {
    selectedServiceData = {
        serviceType: serviceType,
        price: price,
        serviceName: serviceName
    };
    
    // 更新弹窗内容
    document.getElementById('selectedServiceName').textContent = serviceName;
    document.getElementById('selectedServicePrice').textContent = price;
    
    // 显示支付弹窗
    showPaymentModal();
}

// 显示支付弹窗
function showPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
    
    // 添加淡入动画
    setTimeout(() => {
        modal.querySelector('.payment-modal-content').style.opacity = '1';
        modal.querySelector('.payment-modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// 关闭支付弹窗
function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'none';
}

// 确认支付
function proceedToPayment() {
    if (!selectedServiceData.serviceType) {
        alert('请先选择服务！');
        return;
    }
    
    // 生成订单号
    const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
    
    // 创建订单数据
    const orderData = {
        orderId: orderId,
        serviceType: selectedServiceData.serviceType,
        serviceName: selectedServiceData.serviceName,
        price: selectedServiceData.price,
        createTime: new Date().toISOString(),
        status: 'pending'
    };
    
    // 保存订单到本地存储
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('创建订单:', orderData);
    
    // 调用虎皮椒支付
    initiateXunhuPayment(orderData);
}

// 调用虎皮椒支付
function initiateXunhuPayment(orderData) {
    // 显示加载状态
    const confirmBtn = document.querySelector('.confirm-payment-btn');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = '处理中...';
    confirmBtn.disabled = true;
    
    // 调用后端API创建支付订单
    fetch('/api/payment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            serviceType: orderData.serviceType,
            orderId: orderData.orderId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.payment_url) {
            // 跳转到虎皮椒支付页面
            window.location.href = data.payment_url;
        } else {
            alert('支付创建失败: ' + (data.error || '未知错误'));
            // 恢复按钮状态
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('支付请求失败:', error);
        alert('支付请求失败，请重试');
        // 恢复按钮状态
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    });
}

// 生成随机字符串
function generateNonceStr() {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
}

// 支付弹窗设置
document.addEventListener('DOMContentLoaded', function() {
    const paymentModal = document.getElementById('paymentModal');
    
    if (paymentModal) {
        // 点击模态框外部关闭
        window.addEventListener('click', function(e) {
            if (e.target === paymentModal) {
                closePaymentModal();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && paymentModal.style.display === 'block') {
                closePaymentModal();
            }
        });
    }
});
