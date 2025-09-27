import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <ShieldX className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Access Denied</CardTitle>
                    <CardDescription>
                        You don't have permission to access this page. Admin privileges are required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        If you believe this is an error, please contact the system administrator.
                    </p>
                    <div className="flex flex-col space-y-2">
                        <Button asChild>
                            <Link href="/signin">Sign In as Admin</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Go to Homepage</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}