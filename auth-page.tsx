import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect } from "wouter";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Extend validação do schema para formulários
const loginSchema = z.object({
  username: z.string().min(3, "Nome de usuário precisa ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
});

const registerSchema = insertUserSchema.extend({
  username: z.string().min(3, "Nome de usuário precisa ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();

  // Formulário de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Formulário de cadastro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // Redirecionamento se já estiver logado
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      <div className="container mx-auto flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Coluna da esquerda - Formulário */}
          <div>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold font-montserrat mb-2">
                  <span className="text-primary">Roleta</span> Inteligente <span className="text-accent">BR</span>
                </h1>
                <p className="text-gray-400">Acesse sua conta para utilizar todas as funcionalidades</p>
              </div>
              
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Tab de Login */}
              <TabsContent value="login">
                <Card className="bg-[#1e1e1e]">
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Entre com sua conta para continuar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome de usuário</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Digite seu nome de usuário" 
                                  className="bg-[#2d2d2d]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite sua senha" 
                                  className="bg-[#2d2d2d]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Entrando...
                            </>
                          ) : (
                            "Entrar"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-400">
                      Não tem uma conta?{" "}
                      <button 
                        onClick={() => setActiveTab("register")} 
                        className="text-primary hover:underline"
                      >
                        Cadastre-se
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Tab de Cadastro */}
              <TabsContent value="register">
                <Card className="bg-[#1e1e1e]">
                  <CardHeader>
                    <CardTitle>Cadastro</CardTitle>
                    <CardDescription>
                      Crie uma nova conta para acessar a plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome de usuário</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Escolha um nome de usuário" 
                                  className="bg-[#2d2d2d]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Crie uma senha segura" 
                                  className="bg-[#2d2d2d]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar senha</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Repita sua senha" 
                                  className="bg-[#2d2d2d]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cadastrando...
                            </>
                          ) : (
                            "Cadastrar"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-400">
                      Já tem uma conta?{" "}
                      <button 
                        onClick={() => setActiveTab("login")} 
                        className="text-primary hover:underline"
                      >
                        Faça login
                      </button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Coluna da direita - Hero/Informações */}
          <div className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-br from-[#1e1e1e] to-[#2d2d2d] rounded-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-montserrat mb-4">
                Maximize suas chances <br />
                <span className="text-primary">na roleta</span>
              </h2>
              <p className="text-gray-300 text-lg">
                A plataforma completa para análise estatística dos resultados da roleta LotusBet.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-accent rounded-full w-10 h-10 flex items-center justify-center shrink-0 mr-4">
                  <i className="fas fa-chart-line text-[#121212]"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Análise Inteligente</h3>
                  <p className="text-gray-400">Algoritmos avançados para identificar padrões e tendências.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center shrink-0 mr-4">
                  <i className="fas fa-history text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Histórico Detalhado</h3>
                  <p className="text-gray-400">Acompanhe e analise todas suas rodadas anteriores.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center shrink-0 mr-4">
                  <i className="fas fa-dice text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Previsões Precisas</h3>
                  <p className="text-gray-400">Receba indicações dos 5 números mais prováveis na próxima rodada.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}