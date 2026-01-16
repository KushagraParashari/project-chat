import React from 'react'
import { Helmet } from 'react-helmet-async';

const Title = ({ title = "Chat", descripton = "this is the chat app" }) => {
  return (<Helmet>
    <title>{title}</title>
    <meta name="description" content={descripton} />

  </Helmet>
  );
};

export default Title  // vedio time 1:19:00, title not showing in the browser tab, but it is showing in the dev tools, so it is working fine.