import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, Avatar, Snackbar, ConfigProvider, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import Icon20Users3Outline from '@vkontakte/icons/dist/20/users_3_outline';
import ErrorConnect from './panels/ErrorConnect';
import Icon16DoneCircle from '@vkontakte/icons/dist/16/done_circle';
import Icon16Clear from '@vkontakte/icons/dist/16/clear';
import Icon12ErrorCircle from '@vkontakte/icons/dist/12/error_circle';
import './copy.css';
//var Snow = require('react-snow-effect');
//var SnowStorm  = require('react-snowstorm');

function openTab(url) {
    // Create link in memory
    let a = window.document.createElement("a");
    a.target = '_blank';
    a.href = url;

    // Dispatch fake click
    let e = window.document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
};

const queryString = require('query-string');
var chunk = require('chunk')
const parsedHash = queryString.parse(window.location.hash);
const urlParams = queryString.parse(window.location.search.substring());
const ordered = {};
Object.keys(urlParams).sort().forEach((key) => {
    if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
    }
});
const blueBackground = {
    backgroundColor: 'var(--accent)'
};
const orangeBackground = {
    backgroundImage: 'linear-gradient(135deg, #ffb73d, #ffa000)'
};
let isExit = false;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'home',
            popout: null,
            fetching: false,
            friends_count: 0,
            text: '',
            friend_items: [],
            snackbar: null,
            is_token_friends: 0,
            error_menu: false,
            error_text: "Необходимо предоставить доступ к сообществам",
            error_keyboard: true,
            errorDescription: "Технические работы.",
            token: null
        };
        this.goBack = this.goBack.bind(this);
        this.closePopout = this.closePopout.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalTokenFriends = this.closeModalTokenFriends.bind(this);
        this.openBase = this.openBase.bind(this);
        this.getFriendsSnack = this.getFriendsSnack.bind(this);
        this.openError = this.openError.bind(this);
        this.successShare = this.successShare.bind(this);
    }
    getFriendsSnack() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => {
                        this.getFriendGet();
                        this.closeModalTokenFriends()
                        this.setState({ snackbar: null })
                    }}
                    action="Предоставить доступ"
                    // onActionClick={() => this.setState({ text: 'Открыта подробная информация.' })}
                    before={<Avatar size={24} style={orangeBackground}><Icon20Users3Outline fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Для того, чтобы узнать друзей-вездекодеров, мини-приложению нужно предоставить доступ к сообществам.
          </Snackbar>
        });
    }
    goBack() {
        this.setState({ popout: null });
    }

    openBase() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16DoneCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Информация скопирована.
          </Snackbar>
        });
    }
    openError() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16Clear fill="#fff" width={14} height={14} /></Avatar>}
                >
                    {this.state.message_error}
                </Snackbar>
        });
    }
    internetError() {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon12ErrorCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                    Интернет-соединение потеряно :(
                </Snackbar>
        });
    }
    /* internetError() {
         this.setState({
             popout:
                 <Alert
                     actionsLayout="vertical"
                     actions={[{
                         title: 'Понятно',
                         autoclose: true,
                         mode: 'cancel'
                     }]}
                     onClose={this.closePopout}
                 >
                     <h2>Упс...</h2>
                     <p>Интернет-соединение потеряно :( </p>
                 </Alert>
         });
     } */
    successShare(text = "Успешно!") {
        if (this.state.snackbar) return;
        this.setState({
            snackbar:
                <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16DoneCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                    📢 {text}
                </Snackbar>
        });
    }
    componentDidMount() {
        //console.info("Ты похоже заблудился...");
        this.setState({ popout: <ScreenSpinner /> });
        document.addEventListener("keydown", this.escFunction, false);
        window.addEventListener('popstate', e => e.preventDefault() & this.menu(e));
        window.history.pushState({ panel: 'home' }, `home`);
        bridge.subscribe((e) => {
            switch (e.detail.type) {
                case 'VKWebAppGetUserInfoResult':
                    this.setState({ popout: null });
                    //this.getFriendGet();
                    //console.log(e.detail.data);
                    this.setState({ fetchedUser: e.detail.data });
                    // this.auth()
                    this.authParams()
                    /*if(this.state.is_token_friends === 0) {
                            this.setState({ activeModal: 'friendsget'}) 
                        } 
                        if(this.state.is_token_friends === 1) {
                            this.getFriendGet()
                        } */
                    //this.getFriendPromise()
                    if (parsedHash.h) {
                        this.setState({ hash_check: parsedHash.h });
                        this.checkHash()
                    }
                    break;
                case 'VKWebAppAccessTokenFailed':
                    bridge.send("VKWebAppTapticNotificationOccurred", { "type": "error" });
                    this.setState({ error_menu: false, error_keyboard: true })
                    this.setState({ error_text: "Похоже, Вы не предоставили доступ к своим сообществам :(" })
                    break;
                case 'VKWebAppAccessTokenReceived':
                    //console.log(e.detail.data);
                    this.getFriendGetToken(e.detail.data.access_token);
                    break;
                case 'VKWebAppJoinGroupResult':
                    //console.log(e.detail.data);
                    this.successShare("Спасибо за подписку на сообщество :)");
                case 'VKWebAppCallAPIMethodResult':
                    console.log(e.detail.type);
                    //console.log(e.detail.data);
                    break;
                default:
                // console.log(e.detail.type);
                // console.log(e.detail.data);
            }
        });
        bridge.send('VKWebAppGetUserInfo', {});
    }
    getLocationHash() {
        return window.location.hash.replace('#', '')
    }
    getInfo = (data) => {
        if (!data) return;
        // console.log(data);
        this.setState({
            is_coupon: data.is_coupon,
            coupon_id: data.coupon.id,
            coupon_wall: data.coupon_wall,
            coupon_link: data.coupon.link,
            coupon_title: data.coupon.title,
            coupon_icon: data.coupon.icon,
            coupon_organization: data.coupon.organization,
            contest_link: data.contest,
            chat_link: data.chat,
            is_promise: data.is_promise,
            promise_user: data.promise,
            promise_date: data.date_promise,
            is_token_friends: data.is_token_friends
        });
    }
    menu(e) {
        if (e.state) {
            this.setState({ activePanel: e.state.panel });
            this.setState({ copy: true });
            this.setState({ snackbar: null });
        } else {
            // this.setState({ activePanel: 'home' });
            bridge.send("VKWebAppClose", { "status": "success", "payload": { "name": "test" } });
        }
    }
    getFriendGetModal() {
        // this.setState({ activeModal: 'friendsget' })
        this.getFriendsSnack()
    }
    getFriendGet() {
        bridge.send('VKWebAppGetAuthToken', { "app_id": 7836118, "scope": "groups" }).then((data) => {
            /*console.log(123);
            console.log(data);
            console.log(456);*/
            const token = data.access_token;
            this.getFriendGetToken(token);
        }).catch((err) => {
            //console.log(err);
        })
    }

    getFriendGetToken = (token) => {
        if (!token) return console.log("is not token");
        // this.setState({ token: token })

        bridge.send("VKWebAppCallAPIMethod", {
            "method": "groups.getMembers",
            "request_id": "groups.getMembers",
            "params": {
                "group_id": 197700721,
                "filter": "friends",
                "fields": "photo_50",
                "v": "5.151",
                "access_token": token
            }
        }).then((group) => {
            // console.log(group);

            //console.log(fri);


            let friends_data = chunk(group.response.items, 898);
            let users_friends_users = [];
            let users_friends_users_execute = "";

            if (group.response.count == 0) {
                this.setState({ error_menu: false, error_keyboard: false })
                this.setState({ error_text: "Похоже, у Вас нет друзей-вездекодеров :(" })
            } else {
                this.setState({ error_menu: true, error_keyboard: false })
                this.setState({ error_text: "" })
                this.setState({ friends_count: group.response.count, friend_items: group.response.items })
            }

        })
    }
    authParams = () => {
        //console.log(ordered.vk_access_token_settings.indexOf('friends'));
        if (ordered.vk_access_token_settings.indexOf('groups') == -1) {
            // this.setState({ activeModal: 'friendsget' })
            this.getFriendsSnack()
        } else {
            this.getFriendGet()
        }
    }



    go = (e) => {
        this.closePopout();
        this.closeModal();
        this.setState({ activePanel: e.currentTarget.dataset.to })
        this.setState({ snackbar: null })
    };

    closePopout() {
        this.setState({ popout: null });
    }

    closeModal() {
        this.setState({ activeModal: null });
        this.setState({ copy: true });
    }

    closeModalTokenFriends() {
        this.setState({ error_menu: false, error_keyboard: true })
        this.setState({ error_text: "Похоже, Вы не предоставили доступ к своим группам :(" })
        //  this.setState({ activeModal: null });
        this.setState({ copy: true });
        this.setState({ snackbar: null })
    }

    modal = (e) => {
        window.history.pushState({ modal: e.currentTarget.dataset.to }, `${e.currentTarget.dataset.to}`);
        this.setState({ activeModal: e.currentTarget.dataset.to })
    };

    onRefresh = () => {
        this.setState({ fetching: true });
        // this.getFriendPromise()
        // this.auth()
    }
    render() {
        return (
            <ConfigProvider isWebView={true}>
                <View
                    popout={this.state.popout}
                    activePanel={this.state.activePanel}>
                    <Home
                        id="home"
                        chat_link={this.state.chat_link}
                        contest_link={this.state.contest_link}
                        name="Вездекодеры"
                        fetching={this.state.fetching}
                        onRefresh={this.onRefresh}
                        fetchedUser={this.state.fetchedUser}
                        snackbar={this.state.snackbar}
                        friend_items={this.state.friend_items}
                        friends_count={this.state.friends_count}
                        is_token_friends={this.state.is_token_friends}
                        error_menu={this.state.error_menu}
                        error_keyboard={this.state.error_keyboard}
                        error_text={this.state.error_text}
                        getFriendGet={this.getFriendGet}
                        getFriendGetModal={this.getFriendGetModal}
                        verifyNewPromise={this.verifyNewPromise}
                        goBack={this.goBack}
                    />
                    <ErrorConnect
                        id="errorconnect"
                        name="Загрузка..."
                        description={this.state.errorDescription}
                        go={this.go}
                    />
                </View>
            </ConfigProvider>
        );
    }
}

export default App;