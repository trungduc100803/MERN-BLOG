import { BrowserRouter, Routes, Route } from "react-router-dom"
import { routes } from "./routes"

import Home from "./pages/Home"
import About from "./pages/About"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import Header from "./components/Header"
import Footer from "./components/FooterCom"
import PrivateRoute from "./components/PrivateRoute"
import AdminPrivateRoute from "./components/AdminPrivateRoute"
import CreatePost from "./pages/CreatePost"
import UpdatePost from "./pages/UpdatePost"
import Post from "./pages/Post"
import ScrollToTop from "./components/ScrollToTop"
import Search from "./pages/Search"

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.about} element={<About />} />
        <Route path={routes.signIn} element={<SignIn />} />
        <Route path={routes.signUp} element={<SignUp />} />
        <Route path={routes.projects} element={<Projects />} />
        <Route path={routes.search} element={<Search />} />
        <Route element={<PrivateRoute />} >
          <Route path={routes.dashboard} element={<Dashboard />} />
        </Route>
        <Route element={<AdminPrivateRoute />} >
          <Route path={routes.createPost} element={<CreatePost />} />
          <Route path={routes.updatePost} element={<UpdatePost />} />
          <Route path={routes.postDetail} element={<Post/>} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
