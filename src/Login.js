import React, { useState, useContext } from 'react';
import { 
  Box, 
  Center, 
  Text,
  Input as CInput,
  Button,
  Link,
  useToast
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { validateEmail } from "utils/validateEmail"
import request from "utils/request"
import { firestore } from "utils/firebase"
import { setDoc, doc } from 'firebase/firestore/lite';
import { MessengerContext } from "context/messenger"

const Label = ({ children, ...rest }) => (
  <Text 
    fontFamily="DIN2014-Regular"
    fontSize={{ base: "3.5897vw", md: "2vw", xl: "1.04vw"}}
    {...rest}
  >{children}</Text>
)

const Input = React.forwardRef(({...rest}, ref) => (
  <CInput 
    padding="0"
    border="0" 
    borderBottom="2px solid #E6E6E6"
    borderRadius="0" 
    _focus={{
      outline: 'none'
    }}
    _placeholder={{
      color: "#E6E6E6",
      fontFamily: "DIN2014-Regular"
    }}
    _invalid={{
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderBottomColor: "#E53E3E"
    }}
    ref={ref}
    {...rest}
  />
));

export default function App() {
  const messenger = useContext(MessengerContext)
  const router = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const onSubmit = async (data) => {
    setLoading(true)
    const req = request.post(`/company/login`, data)
    req.then((response) => {
      if(response?.data?.AccessToken) {
        const req = request.get(`/companies/${data?.email}`, response?.data?.AccessToken)
        req.then((userData) => {
          setLoading(false)
          if(userData?.data?.email) {
            setDoc(doc(firestore, "user", data?.email), {
              uid: data?.email,
              displayName: userData?.data?.company_name,
              photo: "https://picsum.photos/seed/picsum/200/300",
              email: data?.email,
            }, { merge: true })
            
            messenger.setCurrentUser(userData?.data)
            localStorage.setItem('loginData', JSON.stringify(userData?.data))
            router('/m')
          }
        }).catch(() => {
          setLoading(false)
        })
      } else if(response?.response?.data?.status === "error") {
        let message = ''
        if(response?.response?.data?.message?.original?.message === "NotAuthorizedException") {
          message = "メールアドレス、パスワードのいずれかが有効ではありません。"
        }
        toast({
          title: 'エラー',
          description: message,
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top'
        })
      }
    }).catch((error) => {
      setLoading(false)
      let e = error?.toString()
      let message = e
      if(e?.includes('Incorrect username or password')) {
        message = "メールアドレス、パスワードのいずれかが有効ではありません。"
      }
      toast({
        title: 'エラー',
        description: message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top'
      })
    })
  }

  return (
    <Box>
      <Box 
        pos="relative"
        h="100vh"
        w="100vw"
      >
        <Center
          pos="absolute"
          top="0"
          h="100vh"
          w="100vw"
          fontFamily="DIN2014-Regular"
          flexDir="column"
          justifyContent={{base: 'flex-start', md: 'center'}}
          mt={{base: '38.4615vw', md: 'unset'}}
        >
          <Center 
            w={{ base: "90%", md: "50vw", xl: "31.71vw"}} 
            flexDir="column"
          >
            <Text fontFamily="DIN2014-Bold" fontSize={{ base: '9.2307vw', md: "2.6041vw"}}>LOGIN</Text>
            <Text mt={{base: '1vw', md: 'unset'}} fontFamily="DIN2014-Bold" fontSize={{ base: '3.0769vw', md: "0.8333vw"}}>ログイン</Text>
            <Box mt={{ base: "17vw", md: "3.3vw"}} w="100%">
              <Label>E-mail（メールアドレス）</Label>
              <Input 
                placeholder="info@skettt.com" 
                isInvalid={!!errors?.email}
                {...register("email", {
                  validate: {
                    required: val => {
                      let notEmpty = val.trim().length > 0
                      return notEmpty;
                    }
                  },
                  pattern: {
                    value: validateEmail(),
                    message: "有効なメールアドレスを入力してください。"
                  }
                })}
                onKeyPress={(e) => {
                  if(e?.key === "Enter") {
                    handleSubmit(onSubmit)()
                  }
                }}
              />
              {!!errors?.email && 
                <Text mt="1vw" fontSize={{base: "2.5vw", md: "1.5vw", xl: "0.93vw"}} color="#FF8888">
                  { errors?.email?.message || "E-mail（メールアドレス）は必須です"}
                </Text>
              }
            </Box>
            <Box mt={{ base: '14.9vw', md: "2.22vw"}} w="100%">
              <Label>Password（パスワード）</Label>
              <Input 
                placeholder="12345Kj6789z"
                type="password"
                isInvalid={!!errors?.password}
                {...register("password", 
                  { 
                    validate: {
                      required: val => {
                        let notEmpty = val.trim().length > 0
                        return notEmpty;
                      }
                    },
                  })
                }
                onKeyPress={(e) => {
                  if(e?.key === "Enter") {
                    handleSubmit(onSubmit)()
                  }
                }}
              />
              {!!errors?.password && <Text mt="1vw" fontSize={{base: "2.5vw", md: "1.5vw", xl: "0.93vw"}} color="#FF8888">Password（パスワード）は必須です</Text>}
            </Box>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              isLoading={loading}
              _hover={{
                opacity: 0.8,
                _disabled: {
                  bg: "#1CBF73"
                }
              }}
              loadingText="ログイン"
              mt={{ base: "12.8vw", md: "2.31vw"}}
              mb={{ base: "14vw", md: "2.44vw"}}
              w="100%"
              bg="#1CBF73"
              color="#FFF"
              borderRadius="0px"
            >ログイン</Button>
            <Text mb={{ base: "5vw", md: "0.98vw"}} color="#AFAFAF" fontSize={{ base: "3.5897vw", md: "1.5vw", xl: "0.83vw"}}>
              企業アカウントをお持ちでない方は<Link href="/registration" color="#1CBF73">こちら</Link>
            </Text>
            <Text color="#AFAFAF" fontSize={{ base: "3.5897vw", md: "1.5vw", xl: "0.83vw"}}>
            パスワードをお忘れの方は<Link href="/forgot" color="#1CBF73">こちら</Link>
            </Text>
          </Center>
        </Center>
      </Box>
    </Box>
  );
}