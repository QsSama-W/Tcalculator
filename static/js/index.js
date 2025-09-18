// 全局变量
let currentSets = 10;
// 定义默认运费模板常量
const DEFAULT_SETTINGS = {
    kg1: 5.8,
    kg2: 8.3,
    kg3: 10.8,
    kg4: 13.3,
    xzkg: 2.5,
    jinzhi: 1
};

// DOM 元素引用
const elements = {
    // 尺寸和重量输入
    size1: document.getElementById('size1'),
    size2: document.getElementById('size2'),
    size3: document.getElementById('size3'),
    weight: document.getElementById('weight'),
    estimatedShipping: document.getElementById('estimatedShipping'),
    
    // 价格输入
    price: document.getElementById('price'),
    purchaseShipping: document.getElementById('purchaseShipping'),
    platformPrice: document.getElementById('platformPrice'),
    labelSets: document.getElementById('labelSets'),
    labelShipping: document.getElementById('labelShipping'),
    
    // 结果输出
    cost: document.getElementById('cost'),
    multiple160: document.getElementById('multiple160'),
    multiple140: document.getElementById('multiple140'),
    multiple130: document.getElementById('multiple130'),
    platformProfit: document.getElementById('platformProfit'),
    platformProfitRate: document.getElementById('platformProfitRate'),
    suggestedPrice: document.getElementById('suggestedPrice'),
    suggestedProfit: document.getElementById('suggestedProfit'),
    suggestedProfitRate: document.getElementById('suggestedProfitRate'),
    
    // 菜鸟运费模板设置
    kg1: document.getElementById('kg1'),
    kg2: document.getElementById('kg2'),
    kg3: document.getElementById('kg3'),
    kg4: document.getElementById('kg4'),
    xzkg: document.getElementById('xzkg'),
    jinzhi: document.getElementById('jinzhi'),
    defaultSettings: document.getElementById('defaultSettings'),
    
    // 进制切换按钮
    jinzhi03: document.getElementById('jinzhi03'),
    jinzhi05: document.getElementById('jinzhi05'),
    jinzhi1: document.getElementById('jinzhi1'),
    
    // 按钮
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    copyBtn: document.getElementById('copyBtn'),
    adjustSets: document.getElementById('adjustSets'),
    saveSettings: document.getElementById('saveSettings'),
    
    // 状态信息 - 悬浮框元素
    statusContainer: document.getElementById('statusMessage'),
    statusIcon: document.getElementById('statusIcon'),
    statusText: document.getElementById('statusText')
};

// 初始化
function init() {
    // 加载保存的设置
    loadSettings();
    
    // 设置事件监听器
    setupEventListeners();
}

// 加载保存的设置
function loadSettings() {
    try {
        // 尝试获取本地存储的设置
        const savedSettings = localStorage.getItem('temuCalculatorSettings');
        
        // 如果没有保存的设置，使用默认值
        if (!savedSettings) {
            applySettings(DEFAULT_SETTINGS);
            return;
        }
        
        // 解析并应用保存的设置
        const parsedSettings = JSON.parse(savedSettings);
        const settings = {
            ...DEFAULT_SETTINGS,
            ...parsedSettings
        };
        
        applySettings(settings);
        
    } catch (e) {
        console.error('加载设置失败:', e);
        // 发生错误时使用默认设置
        applySettings(DEFAULT_SETTINGS);
    }
}

// 应用设置到表单
function applySettings(settings) {
    elements.kg1.value = settings.kg1;
    elements.kg2.value = settings.kg2;
    elements.kg3.value = settings.kg3;
    elements.kg4.value = settings.kg4;
    elements.xzkg.value = settings.xzkg;
    elements.jinzhi.value = settings.jinzhi;
    
    // 更新进制按钮状态
    updateJinzhiButtons(settings.jinzhi);
    
    // 触发输入事件以更新相关计算
    elements.kg1.dispatchEvent(new Event('input'));
}

// 更新进制按钮状态
function updateJinzhiButtons(value) {
    // 移除所有按钮的active类
    elements.jinzhi03.classList.remove('active');
    elements.jinzhi05.classList.remove('active');
    elements.jinzhi1.classList.remove('active');
    
    // 根据当前进制值添加active类
    switch(value) {
        case 0.3:
            elements.jinzhi03.classList.add('active');
            break;
        case 0.5:
            elements.jinzhi05.classList.add('active');
            break;
        default: // 1kg
            elements.jinzhi1.classList.add('active');
            break;
    }
}

// 保存设置到本地存储
function saveSettings() {
    try {
        const settings = {
            kg1: parseFloat(elements.kg1.value),
            kg2: parseFloat(elements.kg2.value),
            kg3: parseFloat(elements.kg3.value),
            kg4: parseFloat(elements.kg4.value),
            xzkg: parseFloat(elements.xzkg.value),
            jinzhi: parseFloat(elements.jinzhi.value)
        };
        
        // 验证输入有效性
        if (Object.values(settings).some(value => isNaN(value) || value < 0)) {
            showMessage('请输入有效的数值', 'error');
            return false; // 保存失败
        }
        
        localStorage.setItem('temuCalculatorSettings', JSON.stringify(settings));
        return true; // 保存成功
    } catch (e) {
        console.error('保存设置失败:', e);
        showMessage('保存设置失败', 'error');
        return false; // 保存失败
    }
}

// 初始运费模板功能：填充默认值并保存
function loadDefaultSettingsAndSave() {
    // 填充默认值
    applySettings(DEFAULT_SETTINGS);
    
    // 短暂延迟确保值已正确填充到表单
    setTimeout(() => {
        // 执行保存操作
        const saveSuccess = saveSettings();
        if (saveSuccess) {
            showMessage('已应用并保存初始运费模板');
        } else {
            showMessage('初始运费模板填充成功，但保存失败', 'error');
        }
    }, 100);
}

// 设置事件监听器
function setupEventListeners() {
    // 计算按钮
    elements.calculateBtn.addEventListener('click', calculateAll);
    
    // 重置按钮
    elements.resetBtn.addEventListener('click', resetForm);
    
    // 复制按钮
    elements.copyBtn.addEventListener('click', copySuggestedPrice);
    
    // 调整件/套数
    elements.adjustSets.addEventListener('click', adjustSets);
    
    // 保存设置按钮
    elements.saveSettings.addEventListener('click', () => {
        if (saveSettings()) {
            showMessage('运费模板已保存');
        }
    });
    
    // 初始运费模板按钮
    elements.defaultSettings.addEventListener('click', loadDefaultSettingsAndSave);
    
    // 进制切换按钮
    elements.jinzhi03.addEventListener('click', () => {
        elements.jinzhi.value = 0.3;
        updateJinzhiButtons(0.3);
        calculateShipping();
    });
    
    elements.jinzhi05.addEventListener('click', () => {
        elements.jinzhi.value = 0.5;
        updateJinzhiButtons(0.5);
        calculateShipping();
    });
    
    elements.jinzhi1.addEventListener('click', () => {
        elements.jinzhi.value = 1;
        updateJinzhiButtons(1);
        calculateShipping();
    });
    
    // 输入变化时自动计算运费
    [elements.size1, elements.size2, elements.size3, elements.weight,
        elements.kg1, elements.kg2, elements.kg3, elements.kg4, 
        elements.xzkg, elements.jinzhi].forEach(el => {
        el.addEventListener('input', calculateShipping);
    });
}

// 根据不同进制计算运费
function calculateShipping() {
    try {
        const dim1 = parseFloat(elements.size1.value) || 0;
        const dim2 = parseFloat(elements.size2.value) || 0;
        const dim3 = parseFloat(elements.size3.value) || 0;
        const weight = (parseFloat(elements.weight.value) || 0) / 1000; // 转换为kg
        
        const kg1 = parseFloat(elements.kg1.value) || 0;
        const kg2 = parseFloat(elements.kg2.value) || 0;
        const kg3 = parseFloat(elements.kg3.value) || 0;
        const kg4 = parseFloat(elements.kg4.value) || 0;
        const xzkg = parseFloat(elements.xzkg.value) || 0;
        const jinzhi = parseFloat(elements.jinzhi.value) || 1;
        
        // 计算体积重
        const volume = (dim1 * dim2 * dim3) / 8000;
        const value = volume > weight ? volume : weight;
        
        let result;
        
        // 根据不同进制计算运费
        if (jinzhi === 0.3) {
            result = calculateShippingBy03(value, kg1, kg2, kg3, kg4, xzkg);
        } else if (jinzhi === 0.5) {
            result = calculateShippingBy05(value, kg1, kg2, kg3, kg4, xzkg);
        } else { // 默认1kg进制
            result = calculateShippingBy1(value, kg1, kg2, kg3, kg4, xzkg);
        }
        
        elements.estimatedShipping.value = result.toFixed(2);
        return result;
    } catch (e) {
        console.error('计算运费失败:', e);
        showMessage('请输入有效的数值以计算运费', 'error');
        return 0;
    }
}

// 0.3kg进制计算
function calculateShippingBy03(value, kg1, kg2, kg3, kg4, xzkg) {
    if (value < 0.3 - 1e-9) {  // 小于0.3kg
        return kg1;
    } else if (value < 0.6 - 1e-9) {  // 0.3kg到0.6kg之间
        return kg2;
    } else if (value < 0.9 - 1e-9) {  // 0.6kg到0.9kg之间
        return kg3;
    } else if (value < 1.2 - 1e-9) {  // 0.9kg到1.2kg之间
        return kg4;
    } else {
        // 超过1.2kg的部分，按0.3kg进制计算续重
        const tempValue = value - 1.2;
        const advancedValue = Math.ceil(tempValue / 0.3);
        
        return kg4 + advancedValue * xzkg;
    }
}

// 0.5kg进制计算
function calculateShippingBy05(value, kg1, kg2, kg3, kg4, xzkg) {
    if (value < 0.5 - 1e-9) {  // 小于0.5kg
        return kg1;
    } else if (value < 1.0 - 1e-9) {  // 0.5kg到1.0kg之间
        return kg2;
    } else if (value < 1.5 - 1e-9) {  // 1.0kg到1.5kg之间
        return kg3;
    } else if (value < 2.0 - 1e-9) {  // 1.5kg到2.0kg之间
        return kg4;
    } else {
        // 超过2.0kg的部分，按0.5kg进制计算续重
        const tempValue = value - 2.0;
        const advancedValue = Math.ceil(tempValue / 0.5);
        
        return kg4 + advancedValue * xzkg;
    }
}

// 1kg进制计算
function calculateShippingBy1(value, kg1, kg2, kg3, kg4, xzkg) {
    if (value < 1 - 1e-9) {  // 小于1kg
        return kg1;
    } else if (value < 2 - 1e-9) {  // 1kg到2kg之间
        return kg2;
    } else if (value < 3 - 1e-9) {  // 2kg到3kg之间
        return kg3;
    } else if (value < 4 - 1e-9) {  // 3kg到4kg之间
        return kg4;
    } else {
        // 超过4kg的部分，按1kg进制计算续重
        const tempValue = value - 4;
        const advancedValue = Math.ceil(tempValue);
        
        return kg4 + advancedValue * xzkg;
    }
}

// 计算所有结果
function calculateAll() {
    // 先计算运费
    const shipping = calculateShipping();
    if (shipping === 0) return;
    
    try {
        const price = parseFloat(elements.price.value) || 0;
        const purchaseShipping = parseFloat(elements.purchaseShipping.value) || 0;
        const platformPrice = parseFloat(elements.platformPrice.value) || 0;
        const sets = currentSets;
        
        // 计算各项结果
        const costPerUnit = ((price + purchaseShipping) / sets) + shipping;
        const multiple160 = costPerUnit * 1.7;
        const multiple140 = costPerUnit * 1.5;
        const multiple130 = costPerUnit * 1.4;
        
        // 平台报价利润
        const platformProfit = platformPrice - costPerUnit;
        const platformProfitRate = ((platformPrice / costPerUnit) - 1) * 100;
        
        // 建议报价 (随机增加1.5-2.5)
        const randomAdd = 1.5 + Math.random() * 1;
        const suggestedPrice = multiple160 + randomAdd;
        const suggestedProfit = suggestedPrice - costPerUnit;
        const suggestedProfitRate = ((suggestedPrice / costPerUnit) - 1) * 100;
        
        // 显示结果
        elements.cost.value = costPerUnit.toFixed(2) + '元';
        elements.multiple160.value = multiple160.toFixed(2) + '元';
        elements.multiple140.value = multiple140.toFixed(2) + '元';
        elements.multiple130.value = multiple130.toFixed(2) + '元';
        
        elements.platformProfit.value = platformProfit.toFixed(2) + '元';
        elements.platformProfitRate.value = platformProfitRate.toFixed(2) + '%';
        
        elements.suggestedPrice.value = suggestedPrice.toFixed(2);
        elements.suggestedProfit.value = suggestedProfit.toFixed(2) + '元';
        elements.suggestedProfitRate.value = suggestedProfitRate.toFixed(2) + '%';

        elements.copyBtn.innerHTML = '<i class="fa fa-copy mr-2"></i>复制建议报价';

        showMessage('计算完成');
    } catch (e) {
        console.error('计算失败:', e);
        showMessage('计算失败，请检查输入值', 'error');
    }
}

// 重置表单
function resetForm() {
    // 清空输入框
    elements.size1.value = '';
    elements.size2.value = '';
    elements.size3.value = '';
    elements.weight.value = '';
    elements.estimatedShipping.value = '';
    elements.price.value = '';
    elements.purchaseShipping.value = '';
    elements.platformPrice.value = '';
    
    // 清空结果
    elements.cost.value = '';
    elements.multiple160.value = '';
    elements.multiple140.value = '';
    elements.multiple130.value = '';
    elements.platformProfit.value = '';
    elements.platformProfitRate.value = '';
    elements.suggestedPrice.value = '';
    elements.suggestedProfit.value = '';
    elements.suggestedProfitRate.value = '';
    
    // 重置件/套数为10
    currentSets = 10;
    elements.labelSets.textContent = '10套的售价';
    elements.labelShipping.textContent = '10套采购运费';
    
    // 重置复制按钮
    elements.copyBtn.innerHTML = '<i class="fa fa-copy mr-2"></i>复制建议报价';
    
    showMessage('表单已重置');
}

// 复制建议报价
function copySuggestedPrice() {
    const text = elements.suggestedPrice.value;
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            elements.copyBtn.innerHTML = '<i class="fa fa-check mr-2"></i>已复制';
            showMessage('建议报价已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            showMessage('复制失败，请手动复制', 'error');
        });
    } else {
        showMessage('没有可复制的建议报价', 'error');
    }
}

// 调整件/套数
function adjustSets() {
    const input = prompt('请输入件/套数:', currentSets);
    if (input === null) return; // 用户取消
    
    const num = parseInt(input, 10);
    if (isNaN(num) || num <= 0 || num > 999) {
        showMessage('请输入1-999之间的有效数字', 'error');
        return;
    }
    
    currentSets = num;
    elements.labelSets.textContent = `${num}套的售价`;
    elements.labelShipping.textContent = `${num}套采购运费`;
    showMessage(`已调整为${num}套`);
}

// 显示悬浮消息
function showMessage(text, type = 'info') {
    // 清除之前的定时器
    if (window.toastTimer) {
        clearTimeout(window.toastTimer);
    }
    
    // 设置消息内容和样式
    elements.statusText.textContent = text;
    elements.statusContainer.classList.remove('toast-info', 'toast-error', 'toast-hidden', 'toast-visible');
    
    if (type === 'error') {
        elements.statusContainer.classList.add('toast-error', 'toast-visible');
        elements.statusIcon.className = 'fa fa-exclamation-circle mr-2';
    } else {
        elements.statusContainer.classList.add('toast-info', 'toast-visible');
        elements.statusIcon.className = 'fa fa-info-circle mr-2';
    }
    
    // 3秒后隐藏消息
    window.toastTimer = setTimeout(() => {
        elements.statusContainer.classList.remove('toast-visible');
        elements.statusContainer.classList.add('toast-hidden');
    }, 3000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);