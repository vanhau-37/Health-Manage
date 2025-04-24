export const adminMenu = [
    {
        //Quản lý người dùng
        name: "menu.admin.manage-user",
        menus: [
            {
                name: "menu.admin.manage-user",
                link: "/system/user-manage",
                // subMenus: [
                //     {
                //         name: "menu.system.system-administrator.user-manage",
                //         link: "/system/user-manage",
                //     },
                //     {
                //         name: "menu.system.system-administrator.product-manage",
                //         link: "/system/product-manage",
                //     },
                // ],
            },
        ],
    },
    {
        //Quản lý triệu chứng
        name: "menu.admin.manage-symptom",
        menus: [
            {
                name: "menu.admin.manage-symptom",
                link: "/system/symptom-manage",
            },
        ],
    },
    {
        //Quản lý bệnh
        name: "menu.admin.manage-disease",
        menus: [
            {
                name: "menu.admin.manage-disease",
                link: "/system/disease-manage",
            },
        ],
    },
    {
        //Quản lý tình trạng sức khỏe
        name: "menu.admin.manage-health-status",
        menus: [
            {
                name: "menu.admin.manage-health-status",
                link: "/system/health-status-manage",
            },
        ],
    },
];
