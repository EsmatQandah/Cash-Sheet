export type Language = "ar" | "en";

const translations = {
  appName: { ar: "Cash Sheet", en: "Cash Sheet" },

  // Login
  loginTitle: { ar: "تسجيل الدخول", en: "Sign In" },
  username: { ar: "اسم المستخدم", en: "Username" },
  password: { ar: "كلمة المرور", en: "Password" },
  loginButton: { ar: "دخول", en: "Sign In" },
  loggingIn: { ar: "جارٍ الدخول...", en: "Signing in..." },
  invalidCredentials: { ar: "اسم المستخدم أو كلمة المرور غير صحيحة", en: "Invalid username or password" },
  defaultCredsHint: { ar: "افتراضياً: admin / admin", en: "Default: admin / admin" },

  // Sidebar
  navDashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  navAccounts: { ar: "الحسابات", en: "Accounts" },
  navDeposits: { ar: "الودائع", en: "Deposits" },
  navTransactions: { ar: "المعاملات", en: "Transactions" },
  navHolders: { ar: "أصحاب الحسابات", en: "Account Holders" },
  navBanks: { ar: "البنوك", en: "Banks" },
  navCurrencies: { ar: "العملات", en: "Currencies" },
  navAccountTypes: { ar: "أنواع الحسابات", en: "Account Types" },
  navUsers: { ar: "المستخدمون", en: "Users" },
  logout: { ar: "تسجيل الخروج", en: "Log Out" },

  // Generic grid/table actions
  addRow: { ar: "+ إضافة صف", en: "+ Add Row" },
  deleteSelectedRow: { ar: "حذف الصف المحدد", en: "Delete Selected Row" },
  confirmDeleteRow: { ar: "هل أنت متأكد من حذف هذا الصف؟", en: "Are you sure you want to delete this row?" },
  save: { ar: "حفظ", en: "Save" },
  delete: { ar: "حذف", en: "Delete" },
  choose: { ar: "اختر", en: "Select" },
  notes: { ar: "ملاحظات", en: "Notes" },

  // Holders
  holdersTitle: { ar: "أصحاب الحسابات", en: "Account Holders" },
  fullName: { ar: "الاسم الكامل", en: "Full Name" },
  phone: { ar: "الهاتف", en: "Phone" },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  nationalId: { ar: "الرقم الوطني", en: "National ID" },
  newHolderDefault: { ar: "اسم جديد", en: "New Holder" },

  // Banks
  banksTitle: { ar: "البنوك", en: "Banks" },
  bankName: { ar: "اسم البنك", en: "Bank Name" },
  swiftCode: { ar: "رمز السويفت", en: "SWIFT Code" },
  newBankDefault: { ar: "بنك جديد", en: "New Bank" },

  // Currencies
  currenciesTitle: { ar: "العملات", en: "Currencies" },
  currencyCode: { ar: "الرمز", en: "Code" },
  currencyName: { ar: "الاسم", en: "Name" },
  newCurrencyDefault: { ar: "عملة جديدة", en: "New Currency" },

  // Account types
  accountTypesTitle: { ar: "أنواع الحسابات", en: "Account Types" },
  typeName: { ar: "اسم النوع", en: "Type Name" },
  newTypeDefault: { ar: "نوع جديد", en: "New Type" },

  // Accounts
  accountsTitle: { ar: "الحسابات", en: "Accounts" },
  newAccount: { ar: "+ حساب جديد", en: "+ New Account" },
  editAccount: { ar: "تعديل حساب", en: "Edit Account" },
  accountHolder: { ar: "صاحب الحساب", en: "Account Holder" },
  bank: { ar: "البنك", en: "Bank" },
  accountType: { ar: "نوع الحساب", en: "Account Type" },
  currency: { ar: "العملة", en: "Currency" },
  accountNumber: { ar: "رقم الحساب", en: "Account Number" },
  openingDate: { ar: "تاريخ الفتح", en: "Opening Date" },
  monthlyDueDay: { ar: "يوم الاستحقاق الشهري (1-31)", en: "Monthly Due Day (1-31)" },
  confirmDeleteAccount: { ar: "هل أنت متأكد من حذف هذا الحساب؟", en: "Are you sure you want to delete this account?" },

  // Deposits
  depositsTitle: { ar: "الودائع", en: "Deposits" },
  newDeposit: { ar: "+ وديعة جديدة", en: "+ New Deposit" },
  editDeposit: { ar: "تعديل وديعة", en: "Edit Deposit" },
  account: { ar: "الحساب", en: "Account" },
  principalAmount: { ar: "المبلغ الأساسي", en: "Principal Amount" },
  interestRate: { ar: "نسبة الفائدة %", en: "Interest Rate %" },
  taxRate: { ar: "نسبة الضريبة %", en: "Tax Rate %" },
  startDate: { ar: "تاريخ البدء", en: "Start Date" },
  maturityDate: { ar: "تاريخ الاستحقاق", en: "Maturity Date" },
  confirmDeleteDeposit: { ar: "هل أنت متأكد من حذف هذه الوديعة؟", en: "Are you sure you want to delete this deposit?" },

  // Transactions
  transactionsTitle: { ar: "المعاملات", en: "Transactions" },
  newTransaction: { ar: "+ معاملة جديدة", en: "+ New Transaction" },
  editTransaction: { ar: "تعديل معاملة", en: "Edit Transaction" },
  date: { ar: "التاريخ", en: "Date" },
  description: { ar: "الوصف", en: "Description" },
  amount: { ar: "المبلغ", en: "Amount" },
  type: { ar: "النوع", en: "Type" },
  typeExpense: { ar: "مصروف", en: "Expense" },
  typePayment: { ar: "دفعة", en: "Payment" },
  confirmDeleteTransaction: { ar: "هل أنت متأكد من حذف هذه المعاملة؟", en: "Are you sure you want to delete this transaction?" },

  // Users settings
  usersTitle: { ar: "إدارة المستخدمين", en: "User Management" },
  createdAt: { ar: "تاريخ الإنشاء", en: "Created At" },
  newPassword: { ar: "كلمة مرور جديدة", en: "New Password" },
  update: { ar: "تحديث", en: "Update" },
  addNewUser: { ar: "إضافة مستخدم جديد", en: "Add New User" },
  addUser: { ar: "إضافة", en: "Add" },
  confirmDeleteUser: { ar: "هل أنت متأكد من حذف هذا المستخدم؟", en: "Are you sure you want to delete this user?" },
  cannotDeleteSelf: { ar: "لا يمكنك حذف المستخدم الذي قمت بتسجيل الدخول به", en: "You cannot delete the user you are currently logged in as" },
  addUserError: { ar: "تعذر إضافة المستخدم (قد يكون الاسم مستخدماً بالفعل)", en: "Could not add user (username may already be taken)" },

  // Dashboard
  dashboardTitle: { ar: "لوحة التحكم", en: "Dashboard" },
  depositsUpcoming: { ar: "ودائع قريبة من الاستحقاق", en: "Deposits Approaching Maturity" },
  noDepositsUpcoming: { ar: "لا توجد ودائع مستحقة قريباً", en: "No deposits maturing soon" },
  cardsUpcoming: { ar: "بطاقات ائتمان قريبة من الاستحقاق الشهري", en: "Credit Cards Approaching Monthly Due Date" },
  noCardsUpcoming: { ar: "لا توجد بطاقات ائتمان مستحقة قريباً", en: "No credit cards due soon" },
  accountLabel: { ar: "حساب", en: "Account" },
  maturityLabel: { ar: "استحقاق", en: "Maturity" },
  cardLabel: { ar: "بطاقة", en: "Card" },
  dueDayLabel: { ar: "يوم الاستحقاق", en: "Due day" },
  daysOverdue: { ar: "متأخر {n} يوم", en: "{n} days overdue" },
  dueToday: { ar: "يستحق اليوم", en: "Due today" },
  daysRemaining: { ar: "{n} يوم متبقي", en: "{n} days remaining" },

  // Language toggle
  languageToggle: { ar: "English", en: "العربية" },
} as const;

export type TranslationKey = keyof typeof translations;

export function translate(key: TranslationKey, lang: Language, vars?: Record<string, string | number>): string {
  let text: string = translations[key][lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export default translations;
