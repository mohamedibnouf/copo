import type {
  Branch,
  OperationType,
  TransactionRequest,
  User,
  WorkflowStep,
} from "@/types";

export const COMPANY = {
  nameEn: "COPO KSA",
  nameAr: "شركة كوبو لتقديم الوجبات",
  demoBadge: "Demo Version v1.0 · عرض توضيحي",
} as const;

export const USERS: Record<string, User> = {
  othman: {
    id: "u1",
    name: "Othman Awad",
    initials: "OA",
    avatarColor: "#7c3aed",
  },
  saad: {
    id: "u2",
    name: "Saad Dawas",
    initials: "SD",
    avatarColor: "#ea580c",
  },
  ali: {
    id: "u3",
    name: "Ali Bashuaib",
    initials: "AB",
    avatarColor: "#16a34a",
  },
  wagdy: {
    id: "u4",
    name: "Waqdy Ali abdelaziz",
    initials: "WA",
    avatarColor: "#0284c7",
  },
  ibrahim: {
    id: "u5",
    name: "Ibrahim kamal",
    initials: "IK",
    avatarColor: "#db2777",
  },
  abdurehman: {
    id: "u6",
    name: "abdurehman AlThaian",
    initials: "AT",
    avatarColor: "#059669",
  },
};

export const BRANCHES: Branch[] = [
  {
    id: "copo-ksa",
    nameEn: "COPO KSA",
    nameAr: "شركة كوبو لتقديم الوجبات",
  },
  {
    id: "copo-olia",
    nameEn: "Copo Al-Olia",
    nameAr: "مطعم كوبو العليا",
  },
  {
    id: "blt-cafe",
    nameEn: "BLT Cafe",
    nameAr: "بلت كافيه",
  },
  {
    id: "sadiq-cafe",
    nameEn: "Sadiq Cafe",
    nameAr: "صادق كافيه",
  },
  {
    id: "secret-recipes",
    nameEn: "Secret Recipes",
    nameAr: "وصفات سرية",
  },
];

export const OPERATION_TYPES: OperationType[] = [
  {
    id: "bank-transfer",
    nameEn: "Transfer from bank",
    nameAr: "صرف تحويل من البنك",
  },
  {
    id: "cash-payment",
    nameEn: "Cash payment",
    nameAr: "دفع نقدي",
  },
  {
    id: "supplier-payment",
    nameEn: "Supplier payment",
    nameAr: "سداد مورد",
  },
  {
    id: "maintenance",
    nameEn: "Maintenance request",
    nameAr: "طلب صيانة",
  },
  {
    id: "customer-refund",
    nameEn: "Customer refund",
    nameAr: "استرجاع للعميل",
  },
];

const ACCOUNTANT_BRANCHES: Omit<WorkflowStep, "status">[] = [
  {
    id: "acct-wasfa",
    titleEn: "Wasfa Factory Accountant",
    titleAr: "محاسب مصنع وصفة",
    isBranch: true,
  },
  {
    id: "acct-sadiq",
    titleEn: "Sadiq Cafe Accountant",
    titleAr: "محاسب صادق كافيه",
    isBranch: true,
  },
  {
    id: "acct-oromifa",
    titleEn: "Oromifa Roastery Accountant",
    titleAr: "محاسب محمصة أوروميفا",
    isBranch: true,
  },
  {
    id: "acct-sadiq-gold",
    titleEn: "Al-Sadiq Al-Dhahabi Accountant",
    titleAr: "محاسب شركة الصادق الذهبي",
    isBranch: true,
  },
  {
    id: "acct-secret",
    titleEn: "Secret Recipes Accountant",
    titleAr: "محاسب شركة وصفات سرية",
    isBranch: true,
  },
  {
    id: "acct-copo",
    titleEn: "Copo KSA Accountant",
    titleAr: "محاسب شركة كوبو Copo KSA",
    isBranch: true,
  },
  {
    id: "acct-blt",
    titleEn: "BLT Cafe Accountant",
    titleAr: "محاسب شركة بلت كافيه",
    isBranch: true,
  },
];

export function buildDefaultWorkflow(
  overrides?: Partial<Record<string, import("@/types").StepStatus>>
): WorkflowStep[] {
  const s = (id: string, fallback: import("@/types").StepStatus = "not_started") =>
    overrides?.[id] ?? fallback;

  return [
    {
      id: "start",
      titleEn: "Start",
      titleAr: "البداية",
      status: s("start", "completed"),
      assignee: USERS.othman,
      timestamp: "01/06/2026, 14:57",
    },
    {
      id: "goto-fm",
      titleEn: "Goto-Financial Manager",
      titleAr: "توجيه لمدير المالية",
      status: s("goto-fm", "skipped"),
    },
    {
      id: "ceo",
      titleEn: "CEO",
      titleAr: "المدير التنفيذي",
      status: s("ceo", "in_progress"),
      assignee: USERS.saad,
      deadline: "Deadline: 04/06/2026, 14:57",
    },
    {
      id: "attach-invoices",
      titleEn: "Attach Invoices",
      titleAr: "مرحلة - أرفاق الفواتير",
      status: s("attach-invoices"),
      assignee: USERS.othman,
    },
    {
      id: "financial-manager",
      titleEn: "Financial Manager",
      titleAr: "المدير المالي",
      status: s("financial-manager"),
      assignee: USERS.ali,
      children: ACCOUNTANT_BRANCHES.map((b) => ({
        ...b,
        status: s(b.id),
      })),
    },
    {
      id: "payment-notify",
      titleEn: "Customer payment registration notification",
      titleAr: "إشعار تسجيل عملية دفع للعملاء",
      status: s("payment-notify"),
      assignee: USERS.othman,
      children: [
        {
          id: "fixed-yes",
          titleEn: "Contains a fixed asset",
          titleAr: "تحتوي على أصل ثابت",
          status: s("fixed-yes"),
          isBranch: true,
        },
        {
          id: "fixed-no",
          titleEn: "Does not contain fixed assets",
          titleAr: "لا تحتوي على أصول ثابتة",
          status: s("fixed-no"),
          isBranch: true,
        },
      ],
    },
    {
      id: "review",
      titleEn: "Review and Audit",
      titleAr: "المراجعة والتدقيق",
      status: s("review"),
      assignee: USERS.wagdy,
    },
    {
      id: "archive",
      titleEn: "Archiving and Paper Matching",
      titleAr: "الأرشيف والمطابقة الورقية",
      status: s("archive"),
      assignee: USERS.ibrahim,
    },
    {
      id: "finance-manager-2",
      titleEn: "Finance Manager-2",
      titleAr: "مدير المالية - 2",
      status: s("finance-manager-2"),
      assignee: USERS.ali,
    },
    {
      id: "completed",
      titleEn: "Completed",
      titleAr: "مكتمل",
      status: s("completed"),
    },
  ];
}

export const MOCK_REQUESTS: TransactionRequest[] = [
  {
    id: "req-1",
    seq: 10,
    requestNo: "FR266010",
    date: "2026-06-02",
    branch: BRANCHES[2],
    requester: USERS.othman,
    operationType: OPERATION_TYPES[3],
    searchKeyword:
      "صيانة فلتر جامبو + قلب فلتر أطلس 10كربون + 10بولي",
    lineItems: [
      {
        id: "li-1",
        purpose: "مرافق إيجارية",
        beneficiary: "شركة علي فوزان للصيانة",
        value: 1414.5,
        documentNumber: "S16993",
        attachmentName: "Quotation - S16993 (1).pdf",
        notes: "صيانة فلتر جامبو",
      },
    ],
    status: "in_progress",
    currentStage: "CEO",
    workflow: buildDefaultWorkflow({
      start: "completed",
      "goto-fm": "skipped",
      ceo: "in_progress",
    }),
    comments: [],
    attachments: [
      {
        id: "att-1",
        name: "Quotation - S16993 (1).pdf",
        size: "30.25 KB",
        type: "pdf",
        uploadedAt: "2026-06-02T10:00:00.000Z",
      },
    ],
    createdAt: "2026-06-01T14:57:00.000Z",
    updatedAt: "2026-06-02T08:00:00.000Z",
  },
  {
    id: "req-2",
    seq: 9,
    requestNo: "FR266009",
    date: "2026-06-01",
    branch: BRANCHES[0],
    requester: USERS.abdurehman,
    operationType: OPERATION_TYPES[0],
    searchKeyword: "تحويل بنكي مورد لحوم",
    lineItems: [
      {
        id: "li-2",
        purpose: "Fresh Meat Supply",
        beneficiary: "Al-Rashid Meat Co.",
        value: 18500,
        documentNumber: "INV-8821",
        notes: "Monthly supply",
      },
      {
        id: "li-3",
        purpose: "Delivery charges",
        beneficiary: "Fast Logistics",
        value: 850,
        documentNumber: "DL-441",
        notes: "",
      },
    ],
    status: "pending",
    currentStage: "Financial Manager",
    workflow: buildDefaultWorkflow({
      start: "completed",
      "goto-fm": "skipped",
      ceo: "completed",
      "attach-invoices": "completed",
      "financial-manager": "in_progress",
    }),
    comments: [
      {
        id: "c1",
        author: USERS.ali,
        text: "Please attach supplier invoice before final approval.",
        createdAt: "2026-06-01T16:30:00.000Z",
      },
    ],
    attachments: [],
    createdAt: "2026-05-30T09:00:00.000Z",
    updatedAt: "2026-06-01T16:30:00.000Z",
  },
  {
    id: "req-3",
    seq: 8,
    requestNo: "FR266008",
    date: "2026-05-28",
    branch: BRANCHES[3],
    requester: USERS.othman,
    operationType: OPERATION_TYPES[2],
    searchKeyword: "سداد مورد packaging",
    lineItems: [
      {
        id: "li-4",
        purpose: "Packaging Boxes",
        beneficiary: "Gulf Packaging LLC",
        value: 4200,
        documentNumber: "PK-778",
        notes: "",
      },
    ],
    status: "completed",
    currentStage: "Completed",
    workflow: buildDefaultWorkflow({
      start: "completed",
      "goto-fm": "skipped",
      ceo: "completed",
      "attach-invoices": "completed",
      "financial-manager": "completed",
      "acct-wasfa": "completed",
      "acct-sadiq": "completed",
      "acct-oromifa": "completed",
      "acct-sadiq-gold": "completed",
      "acct-secret": "completed",
      "acct-copo": "completed",
      "acct-blt": "completed",
      "payment-notify": "completed",
      "fixed-yes": "completed",
      "fixed-no": "skipped",
      review: "completed",
      archive: "completed",
      "finance-manager-2": "completed",
      completed: "completed",
    }),
    comments: [],
    attachments: [
      {
        id: "att-2",
        name: "Invoice-PK778.pdf",
        size: "124 KB",
        type: "pdf",
        uploadedAt: "2026-05-28T11:00:00.000Z",
      },
    ],
    createdAt: "2026-05-25T08:00:00.000Z",
    updatedAt: "2026-05-30T14:00:00.000Z",
  },
  {
    id: "req-4",
    seq: 7,
    requestNo: "FR266007",
    date: "2026-05-20",
    branch: BRANCHES[1],
    requester: USERS.abdurehman,
    operationType: OPERATION_TYPES[4],
    searchKeyword: "استرجاع عميل",
    lineItems: [
      {
        id: "li-5",
        purpose: "Customer refund",
        beneficiary: "Customer #4421",
        value: 120,
        documentNumber: "RF-112",
        notes: "Wrong order",
      },
    ],
    status: "rejected",
    currentStage: "CEO",
    workflow: buildDefaultWorkflow({
      start: "completed",
      "goto-fm": "skipped",
      ceo: "rejected",
    }),
    comments: [
      {
        id: "c2",
        author: USERS.saad,
        text: "Rejected — insufficient documentation for refund.",
        createdAt: "2026-05-21T10:00:00.000Z",
      },
    ],
    attachments: [],
    createdAt: "2026-05-20T07:00:00.000Z",
    updatedAt: "2026-05-21T10:00:00.000Z",
  },
  {
    id: "req-5",
    seq: 6,
    requestNo: "FR266006",
    date: "2026-05-15",
    branch: BRANCHES[4],
    requester: USERS.othman,
    operationType: OPERATION_TYPES[1],
    searchKeyword: "دفع نقدي مستلزمات مطبخ",
    lineItems: [
      {
        id: "li-6",
        purpose: "Kitchen supplies",
        beneficiary: "Local Market",
        value: 980,
        documentNumber: "CS-901",
        notes: "Urgent purchase",
      },
    ],
    status: "draft",
    currentStage: "Draft",
    workflow: buildDefaultWorkflow({ start: "not_started" }),
    comments: [],
    attachments: [],
    createdAt: "2026-05-15T12:00:00.000Z",
    updatedAt: "2026-05-15T12:00:00.000Z",
  },
];

export function getNextSeq(requests: TransactionRequest[]) {
  return Math.max(0, ...requests.map((r) => r.seq)) + 1;
}
