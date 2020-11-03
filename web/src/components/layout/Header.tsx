import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";

interface State {
  userMenuOpen: boolean;
  menuOpen: boolean;
}
interface Props {
  title: string;
  tab: string;
}
interface Tab {
  name: string;
  slug: string;
}

export default class Header extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    this.state = {
      menuOpen: false,
      userMenuOpen: false,
    };

    this.setMenuOpen = this.setMenuOpen.bind(this);
    this.setUserMenuOpen = this.setUserMenuOpen.bind(this);
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
      const tag = target.tagName;
      const id = target.id;

      if (!(tag === "BUTTON" && id === "user-menu-button") && !(tag === "IMG" && id === "user-menu-img")) {
        this.setUserMenuOpen(false);
      }
    };
  }

  public render() {
    const activeTab = "text-white bg-gray-900";
    const notActiveTab = "text-gray-300 hover:text-white hover:bg-gray-700";

    const formatTabs = (sm = false, navTabs) => {
      return navTabs.map((tab: Tab, i: number) => (
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
      ));
    };

    return (
      <StaticQuery
        query={graphql`
          query {
            site {
              siteMetadata {
                navTabs {
                  name
                  slug
                }
              }
            }
          }
        `}
        render={({ site }) => (
          <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <button
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                    aria-label="Main menu"
                    aria-expanded={this.state.menuOpen}
                    onClick={() => this.setMenuOpen()}
                  >
                    <svg
                      className={`${this.state.menuOpen ? "hidden" : "block"} h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>

                    <svg
                      className={`${!this.state.menuOpen ? "hidden" : "block"} h-6 w-6`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0">
                    <img
                      className="block lg:hidden h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-on-dark.svg"
                      alt="Workflow logo"
                    />
                    <img
                      className="hidden lg:block h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-logo-on-dark.svg"
                      alt="Workflow logo"
                    />
                  </div>
                  <div className="hidden sm:block sm:ml-6">
                    <div className="flex">{formatTabs(false, site.siteMetadata.navTabs)}</div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button
                    className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                    aria-label="Notifications"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <div className="ml-3 relative">
                    <div>
                      <button
                        className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                        id="user-menu-button"
                        aria-label="User menu"
                        aria-haspopup="true"
                        onClick={() => this.setUserMenuOpen()}
                      >
                        <img
                          className="h-8 w-8 rounded-full"
                          id="user-menu-img"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </button>
                    </div>
                    <div
                      className={
                        this.state.userMenuOpen
                          ? "origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
                          : "hidden"
                      }
                    >
                      <div
                        className="py-1 rounded-md bg-white shadow-xs"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                        aria-expanded={this.state.userMenuOpen}
                      >
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                          role="menuitem"
                        >
                          Your Profile
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                          role="menuitem"
                        >
                          Settings
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                          role="menuitem"
                        >
                          Sign out
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`${this.state.menuOpen ? "block" : "hidden"} sm:hidden`}>
              <div className="px-2 pt-2 pb-3">{formatTabs(true, site.siteMetadata.navTabs)}</div>
            </div>
          </nav>
        )}
      />
    );
  }
}
