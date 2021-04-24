import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormStatus from '@vkontakte/vkui/dist/components/FormStatus/FormStatus';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Icon24View from '@vkontakte/icons/dist/24/view';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon24Fullscreen from '@vkontakte/icons/dist/24/fullscreen';
import Icon24Globe from '@vkontakte/icons/dist/24/globe';
import Icon24Airplay from '@vkontakte/icons/dist/24/airplay';
import Icon24Similar from '@vkontakte/icons/dist/24/similar';
import Icon24Followers from '@vkontakte/icons/dist/24/followers';
import Icon24Qr from '@vkontakte/icons/dist/24/qr';
import './copy.css';

const InfoCheck = props => (
    <Panel id={props.id}>
        <PanelHeader
            left={<PanelHeaderButton onClick={props.go} data-to="home" >
                {<Icon24Back />}
            </PanelHeaderButton>}>
            {props.name}
        </PanelHeader>
        <FormLayout>
            <FormStatus mode="valid">
            Для того чтобы скопировать нужную информацию, нажмите на поле с этой информацией
  </FormStatus>
        </FormLayout>
        <Group>
            <Cell before={<Icon24Globe />} description={props.hostname} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.hostname}` });
            }}>Ресурс</Cell>
            <Cell before={<Icon24Linked />} description={props.ip_info} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.ip_info}` });
            }}>IP</Cell>
            <Cell before={<Icon24Followers />} description={props.country} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.country}` });
            }}>Страна</Cell>
            <Cell before={<Icon24Followers />} description={props.city} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.city}` });
            }}>Город</Cell>
            <Cell before={<Icon24Qr />} description={props.org} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.org}` });
            }}>Организация</Cell>
            <Cell before={<Icon24Airplay />} description={props.isp} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.isp}` });
            }}>Провайдер</Cell>
            <Cell before={<Icon24Similar />} description={props.as} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.as}` });
            }}>AS</Cell>
            <Cell before={<Icon24Fullscreen />} description={props.ping} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.ping}` });
            }}>Ping</Cell>
            <Cell before={<Icon24View />} description={props.views} onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `${props.views}` });
            }}>Просмотров</Cell>
        </Group>
        <Div>
            <Button size="xl" mode="secondary" onClick={() => {
                bridge.send("VKWebAppCopyText", { "text": `https://vk.com/app7652913#h=${props.hash_uid}` });
            }}>Скопировать</Button>
        </Div>
        <Div style={{ display: 'flex' }}>
            <Button size="l" stretched style={{ marginRight: 8 }} onClick={() => {
                bridge.send("VKWebAppShowWallPostBox", {
                    "message": `ℹ Я узнал информацию о ресурсе «${props.value_check}» в приложении IP Checker! 
                    
🔗 Попробуй и ты, например: https://vk.com/app7652913#h=${props.hash_uid}`
                });
            }}>Опубликовать на стене</Button>
            <Button size="l" stretched onClick={() => {
                bridge.send("VKWebAppShare", { "link": `https://vk.com/app7652913#h=${props.hash_uid}` });
            }}>Поделиться</Button>
        </Div>
        {props.snackbar}
    </Panel>
);

InfoCheck.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default InfoCheck;
