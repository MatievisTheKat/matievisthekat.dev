import React, { ReactNode } from "react";
import { StaticQuery, graphql, Link } from "gatsby";

import Menu from "./Menu";
import Tabs from "./Tabs";
import NavBar from "./NavBar";
import UserMenu from "./userMenu/UserMenu";
// import NotifButton from "./NotifButton";

import { getCurrentUser } from "../../../../util";
import { Tab } from "../../../../types";

interface State {
  userMenuOpen: boolean;
  menuOpen: boolean;
}
interface Props {
  title: string;
  tab: string;
}

const NavTabsQuery = graphql`
  query NavTabsQuery {
    site {
      siteMetadata {
        navTabs {
          name
          slug
          admin
        }
      }
    }
  }
`;

export default class Header extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      menuOpen: false,
      userMenuOpen: false,
    };
  }

  private setMenuOpen(menuOpen: boolean = !this.state.menuOpen) {
    this.setState(() => ({ menuOpen }));
  }

  private setUserMenuOpen(userMenuOpen: boolean = !this.state.userMenuOpen) {
    this.setState(() => ({ userMenuOpen }));
  }

  public componentDidMount() {
    document.onclick = (e) => {
      const target = e.target as HTMLElement;

      const isTrigger = target.classList.contains("user-menu-trigger");
      if (!isTrigger && this.state.userMenuOpen === true) {
        this.setUserMenuOpen(false);
      }
    };
  }

  private formatTabs(sm = false, navTabs: Tab[]): ReactNode {
    const activeTab = "text-white bg-gray-900";
    const notActiveTab = "text-gray-300 hover:text-white hover:bg-gray-700";
    const user = getCurrentUser();

    return navTabs.map((tab: Tab, i: number) => {
      if (tab.admin && (!user || !user.admin)) return;
      else {
        return (
          <Link
            key={i}
            to={`/${tab.slug}`}
            className={`${
              sm
                ? `${i !== 0 ? "mt-1" : ""} block px-3 py-2 rounded-md text-base font-medium`
                : `${i !== 0 ? "ml-3" : ""} px-3 py-2 rounded-md text-sm font-medium leading-5`
            } ${
              this.props.tab === tab.slug ? activeTab : notActiveTab
            } focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out`}
          >
            {tab.name}
          </Link>
        );
      }
    });
  }

  public render() {
    return (
      <StaticQuery
        query={NavTabsQuery}
        render={({ site }) => (
          <NavBar menuOpen={this.state.menuOpen} formatTabs={this.formatTabs.bind(this)} navTabs={site.siteMetadata.navTabs}>
            <Menu open={this.state.menuOpen} setOpen={this.setMenuOpen.bind(this)} />
            <Tabs formatTabs={this.formatTabs.bind(this)} navTabs={site.siteMetadata.navTabs} />

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <NotifButton /> */}
              <UserMenu open={this.state.userMenuOpen} setOpen={this.setUserMenuOpen.bind(this)} />
            </div>
          </NavBar>
        )}
      />
    );
  }
}
