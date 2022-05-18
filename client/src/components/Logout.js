import React from 'react'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import LogoutHook from '../hooks/LogoutHook';

export default function Logout() {
  // Logout component used to handle the logout hook
  // when button is pressed, the LogoutHook will run and return true and will notify the useAuth hook
  return (
    <Form className="ms-auto mb-3">
      <Button
          onClick={LogoutHook}
          className=" ms-auto"
          variant="success"
          type="submit"
          >
              Log Out
      </Button>
    </Form>
  );
}
