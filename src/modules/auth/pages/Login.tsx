import useNotification from "@/core/hooks/useNotification";
import NotificationSnackbar from "@/core/layouts/components/Snackbar/components/NotificationSnackbar";
import FormLogin from "../components/FormLogin";

const Login: React.FC = () => {
  const { showNotification, notification, handleAutoClose } = useNotification();

  return (
    <>
      <FormLogin showNotification={showNotification} />
      <NotificationSnackbar
        notification={notification}
        onClose={handleAutoClose}
      />
    </>
  );
};

export default Login;
