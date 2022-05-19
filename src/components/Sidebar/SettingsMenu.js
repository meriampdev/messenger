import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from '@chakra-ui/react'

export const SettingsMenu = () => {
  
  const handleLogout = () => {
    localStorage.removeItem('loginData')
    window.location.replace('/')
  }

  let loginData = localStorage.getItem('loginData')
  let owner = JSON.parse(loginData)
  return (
    <Menu>
      <MenuButton>
        <img className="conversation-photo" src="https://picsum.photos/200/300" alt="conversation" />
      </MenuButton>
      <MenuList>
        <MenuGroup title={owner?.company_name}>
          <MenuItem>My Account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}