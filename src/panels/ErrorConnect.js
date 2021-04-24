import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Icon56SettingsOutline from '@vkontakte/icons/dist/56/settings_outline';
import './copy.css';

const ErrorConnect = props => (
    <Panel id={props.id}>
        <PanelHeader>
            {props.name}
        </PanelHeader>
        <Placeholder
            icon={<Icon56SettingsOutline />}
            stretched
        >
            {props.description}
          </Placeholder>
    </Panel>
);

ErrorConnect.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default ErrorConnect;
