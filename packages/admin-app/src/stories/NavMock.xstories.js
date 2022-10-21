
import React from 'react';
import { linkTo } from '@storybook/addon-links';
//import LinkTo from '@storybook/addon-links/react';
//console.log(theme)
//import { useActiveContext } from "./Dashboard-sidebar-Active.stories";
export default { title: "NavMockups" };


const navStory = localStorage.getItem("Nav-Story");

export const NavUsers = (props) => {
  console.log("PROPS ", props);
  //const backTo = linkTo("Layout Areas/Sidebar/Dashboard/Active")
  //const { backTo } = props;
  //console.log("HOOK ", useActiveContext())
  //const { name } = useActiveContext();
  // console.log("NAME ", localStorage.getItem("Nav-Story"))

  const navStory = localStorage.getItem("Nav-Story");

  const backTo = linkTo("Layout Areas/Sidebar/Dashboard", navStory)
  return <><div>USERS</div><button role="nav-back" onClick={() => {
    backTo()
    //linkTo("Layout")
  }}>Back</button>
  </>
};


NavUsers.storyName = "Users";

export const NavTables = (props) => {
  //console.log("PROPS ", props);

  const navStory = localStorage.getItem("Nav-Story");
  const backTo = linkTo("Layout Areas/Sidebar/Dashboard", navStory)
  return <><div>TABLES</div><button role="nav-back" onClick={() => {
    backTo()

  }}>Back</button>
  </>
};


NavTables.storyName = "Tables";


export const NavLogout = (props) => {
  //console.log("PROPS ", props);

  const navStory = localStorage.getItem("Nav-Story");
  const backTo = linkTo("Layout Areas/Sidebar/Dashboard", navStory)
  return <><div>LOGOUT</div><button role="nav-back" onClick={() => {
    backTo()
  }}>Back</button>
  </>
};


NavLogout.storyName = "Logout";