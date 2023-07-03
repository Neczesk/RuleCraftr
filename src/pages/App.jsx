import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import EditorPage from './ArticleEditor/EditorPage'

import Home from './HomePage/Home'
import RulesetManager from './RulesetManager/RulesetManager'
import LoginPage from './LoginPage/LoginPage'
import ProfileManagement from './ProfileManagement/ProfileManagement'
import Root from './Root'

function App() {
  // createRoutesFromElements(
  //   <Route path="/" element={<RedirectToHome />}>
  //     <Route path="home" element={<Home />}></Route>
  //     <Route path="login" element={<LoginPage handleLogin={login} handleCreateAccount={signup} />} />
  //     <Route path="user/:user/rulesets/:id/editor" element={<EditorPage />}></Route>
  //     <Route path="user/:user/rulesets/" element={<RulesetManager />} />
  //     <Route path="user/:userid/profile" element={<ProfileManagement />} />
  //   </Route>
  // )

  const RedirectToHome = () => {
    return <Navigate to="/home" />
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          index: true,
          element: <RedirectToHome />,
        },
        {
          path: '/home',
          element: <Home />,
        },
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/user/:user/rulesets/:id/editor',
          element: <EditorPage />,
        },
        {
          path: 'user/:user/rulesets/',
          element: <RulesetManager />,
        },
        {
          path: '/user/:userid/profile',
          element: <ProfileManagement />,
        },
      ],
    },
  ])

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
