
export interface AppField {
    source_app_login_id?: string;
    source_app_password?: string;
    source_user_title?: string;
}

export interface UserApplication {
    app_name?: string;
    fields?: AppField[];
}
