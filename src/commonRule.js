/**
 * 标题 常用的规则
 * 描述
 * 创建日期 16/8/24 下午3:47
 * 作者 lei.wang@wuage.com
 * 版本 0.0.1
 */

module.exports = function ($) {

    //手机号(中国大陆)
    $.addValidation('mobile', function (value) {
        return /^(\+?0?86\-?)?((13\d|14[57]|15[^4,\D]|17[678]|18\d)\d{8}|170[059]\d{7})$/.test(value);
    });

    //钱
    $.addValidation('money', function (value) {
        return /^(?!0\.00)(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value);
    });

    //ip
    $.addValidation('ip', function (value) {
        return /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i.test(value);
    });

    //身份证
    $.addValidation('idcard', function (value) {
        var isValid = true;
        var cityCode = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };

        /* 15位校验规则： (dddddd yymmdd xx g)    g奇数为男，偶数为女
         * 18位校验规则： (dddddd yyyymmdd xxx p) xxx奇数为男，偶数为女，p校验位

         校验位公式：C17 = C[ MOD( ∑(Ci*Wi), 11) ]
         i----表示号码字符从由至左包括校验码在内的位置序号
         Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
         Ci 1 0 X 9 8 7 6 5 4 3 2
         */
        var rFormat = /^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$|^\d{6}\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}$/;    // 格式验证

        if (!rFormat.test(value) || !cityCode[value.substr(0, 2)]) {
            isValid = false;
        }
        // 18位身份证需要验证最后一位校验位
        else if (value.length === 18) {
            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子
            var Ci = "10X98765432"; // 校验字符
            // 加权求和
            var sum = 0;
            for (var i = 0; i < 17; i++) {
                sum += value.charAt(i) * Wi[i];
            }
            // 计算校验值
            var C17 = Ci.charAt(sum % 11);
            // 与校验位比对
            if (C17 !== value.charAt(17)) {
                isValid = false;
            }
        }
        return isValid;
    });

}