import { library } from "@fortawesome/fontawesome-svg-core";
import {
  IconDefinition,
  faCaretDown,
  faCaretUp,
  faHome,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ComponentProps } from "react";

const makeIcon = (icon: IconDefinition) => {
  library.add(icon);
  return (props: Omit<ComponentProps<typeof FontAwesomeIcon>, "icon">) => (
    <FontAwesomeIcon {...props} icon={icon} />
  );
};
// ----------------------------------------------
export const IconSearch = makeIcon(faSearch);
export const IconHome = makeIcon(faHome);
export const IconCaretDown = makeIcon(faCaretDown);
export const IConCaretUp = makeIcon(faCaretUp);
