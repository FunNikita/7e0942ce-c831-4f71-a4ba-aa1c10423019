import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOM from 'react-dom';
import bridge from '@vkontakte/vk-bridge';
import App from './App';
// import registerServiceWorker from './sw';

// Init VK App
bridge.send('VKWebAppInit', {});
bridge.subscribe(({ detail: { type, data } }) => {
    if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);

        if (bridge.supports('VKWebAppSetViewSettings')) {
            bridge.send("VKWebAppSetViewSettings", {
                "status_bar_style": data.appearance === 'light' ? 'dark' : 'light',
            });
        }
    }
});
// Если вы хотите, чтобы ваше веб-приложение работало в оффлайне и загружалось быстрее,
// расскомментируйте строку с registerServiceWorker();
// Но не забывайте, что на данный момент у технологии есть достаточно подводных камней
// Подробнее про сервис воркеры можно почитать тут — https://vk.cc/8MHpmT 
// registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('root'));
