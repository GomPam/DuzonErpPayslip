// Defs
const InputPwd = $('input[type="password"]');
const InputData = $('input[name="_viewData"]');

var PayPaper = {
    IsVaild: function() {
        // 급여 명세서를 증명하는 방법:
        // 1. Capicom Object 가 존재하는가?
        // 2. Capicom Object 의 ClassId 가 추출한 값과 동일한가?

        // Google Attachment Preview 기능으로 보게 되면
        // <script> 태그가 자동 삭제되고
        // <object> 태그도 자동 삭제된다.
        // 그러니 위의 증명 방법으로 증명되지 못함.

        // _viewData 가 존재하는지 추가 증명을 하도록 한다.

        var crypto_object = $('#capicom');
        if (crypto_object.length === 0) {
            if (InputData.length === 0) {
                return false;
            }
        }
        else {
            var object_cls = crypto_object.attr('classid');
            if (object_cls === undefined) {
                return false;
            }

            const paypaper_cls = 'CLSID:A440BD76-CFE1-4D46-AB1F-15F238437A3D';
            if (object_cls.toUpperCase() != paypaper_cls.toUpperCase()) {
                return false;
            }
        }

        return true;
    },

    // Inputed Password
    Password: function() {
        return InputPwd.val();
    },
    PasswordReset: function() {
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
    },

    // Decrypt Logic
    Decrypt: function(InputedKey, EncryptedData) {
        // For Legary Support..
        if ($('form[name="0.1_frm"]') !== null) {
            return Decryptor.Decrypt(InputedKey, EncryptedData);
        }
        else {
            // New
            var text = '';
            var bin = unescape(EncryptedData).split(',');
            for (var i = 0; i < bin.length; i++) {
                text = text + String.fromCharCode(Number(bin[i]) + strKey.charCodeAt(i % strKey.length));
            }
            return text;
        }
    }
}
