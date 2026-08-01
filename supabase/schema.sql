-- Comunicar+ — schema inicial do Supabase.
-- Cole este arquivo no SQL Editor do painel do Supabase (Database > SQL Editor)
-- para criar a tabela de progresso.
--
-- O app ainda guarda tudo em localStorage (ver src/context/AppContext.tsx).
-- Esta tabela espelha esse mesmo estado para quando o projeto passar a
-- sincronizar o progresso com o banco. Sem login implementado ainda, cada
-- aparelho usa um perfil_id proprio (gerado e guardado no localStorage).
-- Quando o projeto ganhar autenticacao, perfil_id pode virar uma FK para
-- auth.users e as politicas abaixo devem ser trocadas por checagem de dono.

create table if not exists progresso (
  perfil_id uuid primary key default gen_random_uuid(),
  mascote_id text not null default 'leo',
  estrelas_por_area jsonb not null default '{}'::jsonb,
  sequencia integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table progresso enable row level security;

-- Sem autenticacao ainda: qualquer um que tenha o perfil_id (guardado no
-- localStorage do proprio aparelho) pode ler e escrever aquele progresso.
-- Isso e adequado para um protótipo/projeto escolar, mas antes de ir para
-- producao com usuarios reais troque por politicas presas a auth.uid().
create policy "Ler progresso" on progresso for select using (true);
create policy "Inserir progresso" on progresso for insert with check (true);
create policy "Atualizar progresso" on progresso for update using (true);
