function event_bind() {
    // Password Input
    InputPwd.on(
        'keypress',
        function (evt) {
            // Enter == 13
            if (evt.keyCode == 13)
                decrypt_paypaper();
        }
    );
    InputPwd.on(
        'keyup',
        function (evt) {
            if (this.value.length == 7)
                decrypt_paypaper();
        }
    );

    // Confirm Button
    $('#frm a[href*="ViewPayPaper"]').on(
        'click',
        function (evt) {
            decrypt_paypaper();
        }
    );
}

function decrypt_paypaper() {
    var InputedKey = PayPaper.Key();

    if (InputedKey.length != 7) {
        // HACK: 기존 ViewPayPaper() 가 작동하고 있어, 메세지가 두번 반복됨.
        // alert('비밀번호가 일치하지 않습니다.');
        // PayPaper.KeyReset();
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
}

if (PayPaper.IsVaild()) {
    // KeyEvent, ButtonClick Event Bind
    event_bind();
}
