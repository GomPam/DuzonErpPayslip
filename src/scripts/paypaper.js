// Defs
const InputPwd = $('#pwd');
const InputData = $('#frm input[name="_viewData"]');

var PayPaper = {
    IsVaild: function() {
        // 급여 명세서를 증명하는 방법:
        // 1. Capicom Object 가 존재하는가?
        // 2. Capicom Object 의 ClassId 가 추출한 값과 동일한가?

        var crypto_object = $('#capicom');
        if (crypto_object === null) {
            return false;
        }

        var object_cls = crypto_object.attr('classid');
        if (object_cls === null) {
            return false;
        }

        var paypaper_cls = 'CLSID:A440BD76-CFE1-4D46-AB1F-15F238437A3D';
        if (object_cls.toUpperCase() != paypaper_cls.toUpperCase()) {
            return false;
        }

        return true;
    },

    // Inputed Key
    Key: function() {
        var DecryptKey = InputPwd.val();
        return DecryptKey;
    },

    KeyReset: function() {
        InputPwd.val('');
        InputPwd.focus();
    },

    // Crypted PayPaper Data
    Data: function() {
        var EncryptedData = InputData.val();

        // Removed LineFeed, CarriageReturn
        var regex_pattern = /[\r|\n]/g;
        EncryptedData = EncryptedData.replace(regex_pattern, "");

        return EncryptedData;
    }
}
