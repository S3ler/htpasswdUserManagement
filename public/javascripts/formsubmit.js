async function onSubmit(e) {

    let dialog = document.querySelector('#dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    let dialogsubmitbutton = document.querySelector('#dialogsubmitbutton');
    dialogsubmitbutton.addEventListener('click', function () {
        dialog.close(true);
    });
    let dialogcancelbutton = document.querySelector('#dialogcancelbutton');
    dialogcancelbutton.addEventListener('click', function () {
        dialog.close(false);
    });

    dialog.showModal();
    dialog.addEventListener('close', function (event) {
        if (dialog.returnValue) {
            console.log("true");
            let adminuserinputfound = false;
            let adminpasswordinputfound = false;
            for (let i = 0; i < e.childNodes.length; i++) {
                let childDiv = e.childNodes[i];
                if (childDiv instanceof HTMLDivElement) {
                    let childInput = childDiv.childNodes[0];
                    if (childInput instanceof HTMLInputElement && childInput.type === 'text' && childInput.name === 'adminuser') {
                        adminuserinputfound = true;
                        childInput.value = document.querySelector('#dialogadminuser');
                    } else if (childInput instanceof HTMLInputElement && childInput.type === 'password' && childInput.name === 'adminpassword') {
                        adminpasswordinputfound = true;
                        childInput.value = document.querySelector('#dialogadminpassword');
                    }
                }
            }
            if (adminpasswordinputfound && adminpasswordinputfound) {
                e.submit();
            }
        } else {
            console.log("false");
        }
    });
};