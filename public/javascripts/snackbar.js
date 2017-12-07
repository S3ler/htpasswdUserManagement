(function () {
    'use strict';

    function getParameterByName(name, url) {
        'use strict';
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    window.onload=function () {
        'use strict';
        let reason = getParameterByName('reason');
        if(reason !== null){
            let snackbarContainer = document.getElementById('demo-snackbar-example');
            let data = {
                message: reason,
                timeout: 10000,
                actionHandler: null,
                actionText: 'Hide'
            };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    };

}());
