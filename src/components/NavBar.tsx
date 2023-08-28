import { Avatar, Dropdown, Navbar } from "flowbite-react/lib/esm/components";
import { Link, useNavigate } from "react-router-dom";
import { lcStorage } from "../config/lcStorage";
import { User, useUser } from "../config/auth";

export function NavBar() {
  const navigate = useNavigate();
  const { data }: { data: User | null } = useUser();

  const handleLogout = () => {
    console.log("logout");
    lcStorage.clearUser();
    navigate("/login");
  };

  return (
    <Navbar fluid={true} rounded={true} className="w-full shrink-0 !pl-0">
      <div className="flex">
        <Link to="/" className="flex items-center">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8 mr-3"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Atlas
          </span>
        </Link>
      </div>
      <div className="z-[10000] flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline={true}
          label={<Avatar alt="User settings" rounded={true} />}
          className="z-[10000]"
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {data?.firstName} {data?.lastName}
            </span>
            <span className="block truncate text-sm font-medium">
              {data?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}
