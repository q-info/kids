class VRButton {
    static createButton(renderer) {
        const button = document.createElement('button');

        function showEnterVR() {
            button.style.display = '';
            button.style.cursor = 'pointer';
            button.style.left = 'calc(50% - 50px)';
            button.style.width = '100px';
            button.textContent = 'ENTER VR';

            button.onclick = () => {
                renderer.xr.enabled = true;

                navigator.xr.requestSession('immersive-vr')
                    .then((session) => {
                        renderer.xr.setSession(session);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            };
        }

        function showWebXRNotFound() {
            button.textContent = 'VR NOT SUPPORTED';
            button.style.cursor = 'auto';
            button.style.display = '';
        }

        if ('xr' in navigator) {
            navigator.xr.isSessionSupported('immersive-vr')
                .then((supported) => {
                    supported ? showEnterVR() : showWebXRNotFound();
                });
        } else {
            showWebXRNotFound();
        }

        button.style.position = 'absolute';
        button.style.bottom = '20px';
        button.style.padding = '12px 20px';
        button.style.border = '1px solid white';
        button.style.borderRadius = '4px';
        button.style.background = 'rgba(0,0,0,0.5)';
        button.style.color = 'white';

        return button;
    }
}