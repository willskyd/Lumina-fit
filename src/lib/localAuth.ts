import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppUser } from "../types/models";

const USERS_STORAGE_KEY = "lumina-fit-users";
const CURRENT_USER_STORAGE_KEY = "lumina-fit-current-user";

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  membership: string;
  hasActiveSubscription: boolean;
  subscriptionExpiry: string | null;
}

const ADMIN_EMAIL = "linafit12@gmail.com";
const ADMIN_PASSWORD = "luna1234";
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo123";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function createAdminUser(): StoredUser {
  return {
    id: "admin-001",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: "Lumina Admin",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    membership: "Admin",
    hasActiveSubscription: true,
    subscriptionExpiry: null
  };
}

function createDemoUser(): StoredUser {
  return {
    id: "demo-user",
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    name: "Demo User",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    membership: "Basic Member",
    hasActiveSubscription: false,
    subscriptionExpiry: null
  };
}

// Initialize with admin and demo accounts
async function ensureDefaultAccountsExist() {
  const users = await getAllUsers();
  const normalizedAdminEmail = normalizeEmail(ADMIN_EMAIL);
  const normalizedDemoEmail = normalizeEmail(DEMO_EMAIL);

  // Ensure the reserved admin account always exists with the expected access.
  const adminIndex = users.findIndex((user) => normalizeEmail(user.email) === normalizedAdminEmail);
  if (adminIndex === -1) {
    users.unshift(createAdminUser());
  } else {
    users[adminIndex] = createAdminUser();
  }

  // Keep the demo account available for non-admin testing.
  const demoIndex = users.findIndex((user) => normalizeEmail(user.email) === normalizedDemoEmail);
  if (demoIndex === -1) {
    users.push(createDemoUser());
  }

  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

async function getAllUsers(): Promise<StoredUser[]> {
  const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function signUpLocal(email: string, password: string, name: string) {
  await ensureDefaultAccountsExist();
  const users = await getAllUsers();
  const normalizedEmail = normalizeEmail(email);

  // Check if email already exists
  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    throw new Error("Email already registered");
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    password,
    name,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    membership: "Basic Member",
    hasActiveSubscription: false,
    subscriptionExpiry: null
  };

  users.push(newUser);
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));

  return toAppUser(newUser);
}

export async function signInLocal(email: string, password: string) {
  await ensureDefaultAccountsExist();
  const users = await getAllUsers();
  const normalizedEmail = normalizeEmail(email);
  const user = users.find(
    (storedUser) =>
      normalizeEmail(storedUser.email) === normalizedEmail && storedUser.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Store current user
  await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));

  return toAppUser(user);
}

export async function signOutLocal() {
  await AsyncStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export async function getCurrentLocalUser(): Promise<AppUser | null> {
  const stored = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (!stored) return null;

  const user: StoredUser = JSON.parse(stored);
  return toAppUser(user);
}

export async function updateUserSubscription(
  userId: string,
  hasActive: boolean,
  expiryDate: string | null
) {
  const users = await getAllUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex].hasActiveSubscription = hasActive;
  users[userIndex].subscriptionExpiry = expiryDate;

  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Update current user if it's the logged-in user
  const currentUser = await AsyncStorage.getItem(CURRENT_USER_STORAGE_KEY);
  if (currentUser) {
    const parsedCurrent: StoredUser = JSON.parse(currentUser);
    if (parsedCurrent.id === userId) {
      parsedCurrent.hasActiveSubscription = hasActive;
      parsedCurrent.subscriptionExpiry = expiryDate;
      await AsyncStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(parsedCurrent));
    }
  }
}

export async function isAdmin(email: string, password: string): Promise<boolean> {
  return normalizeEmail(email) === normalizeEmail(ADMIN_EMAIL) && password === ADMIN_PASSWORD;
}

export async function getAllStoredUsers(): Promise<AppUser[]> {
  await ensureDefaultAccountsExist();
  const users = await getAllUsers();
  return users.map(toAppUser);
}

function toAppUser(user: StoredUser): AppUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    membership: user.membership,
    hasActiveSubscription: user.hasActiveSubscription,
    subscriptionExpiry: user.subscriptionExpiry,
    isAdmin: user.membership === "Admin"
  };
}
