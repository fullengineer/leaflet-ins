import { Navigate, useNavigate } from "react-router-dom";
import { User } from "../../config/lcStorage";
import { getUser, useLogin } from "../../config/auth";
import { useState } from "react";
import { Label, Button, TextInput } from "flowbite-react/lib/esm/components";

const useForm = <V extends Record<string, any>>(initialValues?: V) => {
  const [values, setValues] = useState<V | unknown>(initialValues || {});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v: V) => ({ ...v, [e.target.name]: e.target.value }));
  };

  return {
    values: values as V,
    onChange,
  };
};

export default function LoginPage() {
  const { values, onChange } = useForm<{ email: string; password: string }>();
  const login = useLogin();
  const navigate = useNavigate();
  const user: User | null = getUser();

  if (user?.email) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate({
            onSuccess: () => {
              navigate("/");
            },
          });
        }}
      >
        <div>
          <div className="mb-2 block">
            <label htmlFor="email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@burro.ai"
            name="email"
            onChange={onChange}
            value={values.email}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="password"
            name="password"
            onChange={onChange}
            value={values.password}
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
