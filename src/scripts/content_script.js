function event_bind() {
    // Password Input
    InputPwd.on(
        'keypress',
        function (evt) {
            // Enter == 13
            if (evt.keyCode == 13)
                return decrypt_paypaper();
        }
    );
    InputPwd.on(
        'keyup',
        function (evt) {
            if (this.value.length == this.maxLength)
                return decrypt_paypaper();
        }
    );

    // Confirm Button
    $('a:has(img)').on(
        'click',
        function (evt) {
            return decrypt_paypaper();
        }
    );
}

function decrypt_paypaper() {
    var InputedKey = PayPaper.Password();
    var InputPwdMaxLength = InputPwd.get(0).maxLength;

    if (InputedKey.length != InputPwdMaxLength) {
        error_alert(0, InputedKey.length + '/' + InputPwdMaxLength);
    }
    else {
        try {
            var EncryptedData = PayPaper.Data();
            var HtmlData = PayPaper.Decrypt(InputedKey, EncryptedData);

            if (HtmlData.search(/html/) > -1) {
                document.write(HtmlData);
            }
            else {
                throw "Decrypting Error";
            }
        }
        catch(e) {
            error_alert(1, e);
        }
    }

    // Event 전파 방지
    return false;
}

function error_alert(err, msg_text) {
    alert('비밀번호가 올바르지 않습니다. (err: ' + err + ') - [' + msg_text + ']');
    PayPaper.PasswordReset();
}

if (PayPaper.IsVaild()) {
    // KeyEvent, ButtonClick Event Bind
    event_bind();
}
