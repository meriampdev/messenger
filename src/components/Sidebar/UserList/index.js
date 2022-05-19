import { useEffect, useState, useContext } from 'react';
import {
  Box,
  IconButton,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { MessengerContext } from "context/messenger"
import ConversationItem from 'components/Sidebar/Item';
import { EditIcon } from '@chakra-ui/icons'
import { firebase } from "utils/firebase"
import { 
  getFirestore, 
  collection, 
  doc,
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';

export const UserList = () => {
  const messenger = useContext(MessengerContext)
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let loginData = localStorage.getItem('loginData')
    if(!!loginData) {
      let owner = JSON.parse(loginData)
      getUsers(owner?.email)
    }
  }, [])

  const getUsers = async (ownerEmail) => {
    const db = getFirestore(firebase)
    const q = query(collection(db, "user"), where("email", "!=", ownerEmail));
    const usersSnapShot = await getDocs(q);
    const userList = usersSnapShot.docs.map(doc => doc.data());
    let newUserList = userList.map(result => {
      return {
        photo: result?.photo,
        name: result?.displayName,
        text: '',
        email: result?.email
      };
    });
    setUsers(newUserList)
  }

  const onSelectContact = async (user) => {
    let loginData = localStorage.getItem('loginData')
    let owner = JSON.parse(loginData)

    let groupData = {
      createdAt: serverTimestamp(),
      createdBy: owner?.email,
      members: [user?.email, owner?.email],
      membersData: {
        [user?.email]: user,
        [owner?.email]: {
          email: owner?.email,
          name: owner?.company_name,
          photo: "https://picsum.photos/seed/picsum/200/300"
        }
      }
    }

    try {
      const db = getFirestore(firebase)
      const docRef = await addDoc(collection(db, "conversation"), groupData, { merge: true })
      await updateDoc(docRef, { id: docRef.id });
      onClose()
      const user1 = doc(db, "user", owner?.email);
      updateDoc(user1, { conversations: arrayUnion(docRef.id) })
      const user2 = doc(db, "user", user?.email);
      updateDoc(user2, { conversations: arrayUnion(docRef.id) })
      messenger.setCurrentConvo(docRef.id)
    } catch(e) {
      console.log('e', e)
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-start"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <IconButton colorScheme='green' size='sm' icon={<EditIcon />} />
      </PopoverTrigger>
      <PopoverContent p={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <Box pt="1vw">
          <Input placeholder="To:" />
        </Box>
        <Box>
          {users?.map((user) => {
            return (
              <ConversationItem
                key={user.name}
                data={user}
                onClick={() => onSelectContact(user)}
              />
            )
          })}
        </Box>
      </PopoverContent>
    </Popover>
  )
}