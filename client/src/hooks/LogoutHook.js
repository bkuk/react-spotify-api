// logoutHook will send a true value over to the useAuth hook
// accessToken must be cleared to logout
export default function LogoutHook() {
  const changeLogout = true;

  return (changeLogout);
}
