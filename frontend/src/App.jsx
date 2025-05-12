import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import LoginPage from "./pages/loginPage/LoginPage";
import RegisterPage from "./pages/registerPage/registerPage";
import CreateChannelPage from "./pages/createChannelPage/createChannelPage";
import YourChannelsPage from "./pages/yourChannelsPage/YourChannelsPage";
import ChannelPage from "./pages/channelPage/ChannelPage";
import AllChannelsPage  from "./pages/allChannelsPage/AllChannelsPage";
import ChannelsPage from "./pages/channelsPage/ChannelsPage";
import SubscriptionsPage from "./pages/subscriptionsPage/SubscriptionsPage";

export const MyContext = createContext();

const App = () => {

  const [user, setUser] = useState({ name: "", password: "", token: "" });

  return (
    <BrowserRouter>
    <MyContext.Provider value={{ user, setUser}}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/allChannels" element={<AllChannelsPage />} />
        <Route path="/allChannels/channel/:channelId" element={<ChannelsPage />} />
        <Route path="/:userId/createChannel" element={<CreateChannelPage />} />
        <Route path="/:userId/yourChannels" element={<YourChannelsPage />} />
        <Route path="/:userId/yourChannels/:channelId" element={<ChannelPage />} />
        <Route path="/:userId/subscriptions" element={<SubscriptionsPage />} />
        
      </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
};

export default App;
