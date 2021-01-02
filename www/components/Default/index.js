class DefaultElement extends HTMLElement {

    connectedCallback() {
        let $shadow = this.attachShadow({mode: 'open'});
        let $style  = document.createElement('link');
            $style.setAttribute('rel','stylesheet');
            $style.setAttribute('type','text/css');
            $style.setAttribute('href','components/'+this.constructor.name+'/style.css');

            $shadow.prepend($style);
    }

}
