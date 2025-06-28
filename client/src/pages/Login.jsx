// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const api = useApi();

  // אם כבר מחובר, נזרוק מיד ל-Dashboard
  useEffect(() => {
    if (token) {
      nav("/dashboard", { replace: true });
    }
  }, [token, nav]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });
      // שומרים ב-context + localStorage
      login(data.token, data.user);
      // מפנים לדאשבורד
      nav("/dashboard");
    } catch (err) {
      toast({
        status: "error",
        description: err.response?.data?.message || "שגיאת התחברות",
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} p={8} borderWidth="1px" borderRadius="lg">
      <Heading mb={6} textAlign="center">
        התחברות
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>אימייל</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>סיסמה</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" type="submit" w="full">
            התחבר
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
