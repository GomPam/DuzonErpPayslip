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
            if (this.value.length == 7)
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
    var InputedKey = PayPaper.Key();

    if (InputedKey.length != 7) {
        alert('비밀번호가 올바르지 않습니다.');
        PayPaper.KeyReset();
    }
    else {
        var EncryptedData = PayPaper.Data();
        var HtmlData = Decryptor.Decrypt(InputedKey, EncryptedData);

        if (HtmlData.search(/html/) > -1) {
            document.write(HtmlData);
        }
        else {
            alert('비밀번호가 일치하지 않습니다.');
            PayPaper.KeyReset();
        }
    }

    // Event 전파 방지
    return false;
}

if (PayPaper.IsVaild()) {
    // KeyEvent, ButtonClick Event Bind
    event_bind();
}
