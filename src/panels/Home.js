import React from 'react';
import PropTypes from 'prop-types';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderContent from '@vkontakte/vkui/dist/components/PanelHeaderContent/PanelHeaderContent';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Placeholder from '@vkontakte/vkui/dist/components/Placeholder/Placeholder';
import PullToRefresh from '@vkontakte/vkui/dist/components/PullToRefresh/PullToRefresh';
import Icon24Users from '@vkontakte/icons/dist/24/users';
import RichCell from '@vkontakte/vkui/dist/components/RichCell/RichCell';
import './copy.css';
//var Snow = require('react-snow-effect');

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

function Blog(props) {
	// console.log(props);

	const content = Object.keys(props.posts).map((post) =>
		<div key={post.id}>
			<RichCell
				disabled
				multiline
				before={<Avatar size={48} src={props.posts[post].photo_50} />}
				onClick={() => openTab("https://vk.com/id" + props.posts[post].id)}
			>
				{`${props.posts[post].first_name} ${props.posts[post].last_name}`}
			</RichCell>
		</div>
	);

	return (
		<div>

			{content}
		</div>
	);
}

const Home = props => (
	<Panel id={props.id}>

		<PanelHeader>
			<PanelHeaderContent
				status={props.name}
			>
				Главная
      </PanelHeaderContent>
		</PanelHeader>

		<PullToRefresh onRefresh={props.onRefresh} isFetching={props.fetching}>


			{props.error_menu === true ? <Group header={<Header mode="secondary" className="noselect">Друзья-Вездекодеры ({props.friends_count})</Header>}>
				<Blog posts={props.friend_items} />
			</Group > : null}
			{props.error_menu === false && props.error_keyboard === false ?
				<Placeholder>
					{props.error_text}
				</Placeholder>
				: null}
			{props.error_menu === false && props.error_keyboard === true ?
				<Placeholder
					action={<Button before={<Icon24Users />} onClick={props.getFriendGet} size="l">Предоставить доступ</Button>}
				>
					{props.error_text}
				</Placeholder>
				: null}

		</PullToRefresh>
		{ props.snackbar}
	</Panel >
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
};

export default Home;
