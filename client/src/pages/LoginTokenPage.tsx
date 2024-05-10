import {
  ActionFunction,
  Form,
  Navigate,
  redirect,
  useActionData,
} from "react-router-dom";
import { appAPI } from "../api/appAPI";
import { pageURL } from "../common/url";
import { TextField } from "../components/ui/Input";
import { useValidation } from "../hooks/use-validation";
import { store, useAppSelector } from "../store";
import { authSlice } from "../store/auth-slice";
import { storage } from "../storage/storage";

export const LoginTokenPage = () => {
  const user = useAppSelector((store) => store.auth.user);
  const tokenInput = useValidation((v) => v.convertTrim().notEmpty(), "");
  const errorMessage = useActionData() as string;

  const inputs = [tokenInput];

  if (user) return <Navigate to={pageURL.home} />;

  const submitHandler = (evt) => {
    let hasError = false;

    inputs.forEach((input) => {
      if (input.validate()) return;
      hasError = true;
    });
    if (hasError) return evt.preventDefault();
  };

  return (
    <Form
      className="grid gap-4 mt-12 mx-auto max-w-[500px] w-full p-4"
      onSubmit={submitHandler}
      method="POST"
    >
      <h2 className="text-2xl">Login token</h2>
      {errorMessage && (
        <div className="bg-danger px-2 py-1">{errorMessage}</div>
      )}
      <TextField
        {...tokenInput.inputProps}
        label="Your token !!"
        name="token"
        error={tokenInput.error}
      />
      <button type="submit">Login</button>
    </Form>
  );
};

const action: ActionFunction = async ({ request }) => {
  console.log("run get action");
  const token: any = (await request.formData()).get("token");
  const [{ user }, error] = await appAPI.getAuth(token).safe();
  if (error) return error?.message || "Unknown Error!";
  if (!user) return "Login failed!";
  
  storage.auth.write(user);
  store.dispatch(authSlice.actions.login(user));
  return redirect(pageURL.home);
};

// ----------------------------------------------
LoginTokenPage.action = action;
