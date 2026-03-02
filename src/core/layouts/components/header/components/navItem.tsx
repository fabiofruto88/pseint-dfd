import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import type { NavigationItem } from "../../../../../modules/auth/config/navigation.config";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

type NavItemProps = {
  item: NavigationItem;
  level?: number;
  openItems: { [key: string]: boolean };
  handleItemClick: (item: NavigationItem) => void;
  isActive?: (path: string) => boolean;
};

export default function NavItem({
  item,
  level = 0,
  openItems,
  handleItemClick,
  isActive,
}: NavItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItems[item.path];
  const active = isActive
    ? isActive(item.path)
    : location.pathname === item.path;

  return (
    <Box key={item.path} sx={{ mx: 1, my: 1 }}>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => handleItemClick(item)}
          selected={active}
          sx={{
            pl: 2 + level * 2,
            bgcolor: active ? "action.selected" : "transparent",
            borderRadius: 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {hasChildren &&
            (isOpen ? (
              <ChevronUpIcon style={{ width: 20, height: 20 }} />
            ) : (
              <ChevronDownIcon style={{ width: 20, height: 20 }} />
            ))}
        </ListItemButton>
      </ListItem>

      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children!.map((child) => (
              <NavItem
                key={child.path}
                item={child}
                level={level + 1}
                openItems={openItems}
                handleItemClick={handleItemClick}
                isActive={isActive}
              />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
}
