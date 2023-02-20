export interface Printer {
	printer: string;
	description: string | null;
	status: string | null;
	alerts: string | null;
	connection: string | null;
}

export interface ExecResponse {
	stdout: string | null;
	stderr: string | null;
}
