import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useLang } from "../hooks/useLang";

export function NotFound() {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <Card className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="text-4xl">🧭</span>
      <h1 className="text-xl font-extrabold text-[var(--text)]">{t.notFound.title}</h1>
      <p className="text-[var(--text-muted)]">{t.notFound.text}</p>
      <Button onClick={() => navigate("/")}>{t.notFound.back}</Button>
    </Card>
  );
}
