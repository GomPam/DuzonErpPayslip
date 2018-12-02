function EventBinding() {
    // Password Input
    InputPwd.on(
        'keypress',
        function (evt) {
            // Enter == 13
            if (evt.keyCode == 13)
                return ViewPaysilp();
        }
    );
    InputPwd.on(
        'keyup',
        function (evt) {
            if (this.value.length == this.maxLength)
                return ViewPaysilp();
        }
    );

    // Confirm Button
    $('a:has(img)').on(
        'click',
        function (evt) {
            return ViewPaysilp();
        }
    );
}

function ViewPaysilp() {
    if (Paysilp.Password().length != InputPwd.get(0).maxLength) {
        ErrorAlert(0, Paysilp.Password().length + '/' + InputPwd.get(0).maxLength);
    }
    else {
        try {
            var HtmlData = Decryptor.Decrypt(Paysilp.Password(), Paysilp.Data());
            if (HtmlData.search(/html/) > -1) {
                document.write(HtmlData);
            }
            else {
                throw "Decrypting Error";
            }
        }
        catch(e) {
            ErrorAlert(1, e);
        }
    }

    // Event 전파 방지
    return false;
}

function ErrorAlert(err, msg_text) {
    Paysilp.PasswordReset();
    alert('비밀번호가 올바르지 않습니다. (err: ' + err + ') - [' + msg_text + ']');
}

if (Paysilp.IsVaild()) {
    // KeyEvent, ButtonClick Event Bind
    EventBinding();
}
