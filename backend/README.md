# Modufield Backend

NestJS + GraphQL + Prisma 기반 체육시설 예약 플랫폼 백엔드.

## 로컬 개발 환경
```bash
# 의존성 설치
pnpm install

# 개발 서버 (Hot-reload)
pnpm start:dev
```

## Docker 환경 실행
```bash
docker compose up --build   # PostgreSQL(PostGIS)·MongoDB·Redis 포함 전체 스택 기동
docker compose down -v      # 컨테이너·볼륨 정리
```

컨테이너 부팅 순서:
1. PostgreSQL(PostGIS) 컨테이너 → PostGIS 확장이 이미 포함된 이미지 사용
2. `api-prod` 컨테이너 → `pnpm prisma migrate deploy` 로 마이그레이션 적용 → 앱 시작

> `.env` 파일에 `KAKAO_MAP_API_KEY`, `DATABASE_URL`, `MONGO_URI` 등을 설정하세요.

## 데이터베이스 & Prisma 마이그레이션

### 구조
1. **PostgreSQL + PostGIS**
   - `docker-compose.yml` 의 `postgis/postgis:17-3.4-alpine` 이미지 사용
   - `db-init/00-init-extensions.sql` 에서 PostGIS 확장 활성화
2. **Prisma**
   - 컨테이너 기동 시 `pnpm prisma migrate deploy` 자동 실행 → 커밋된 마이그레이션을 DB에 적용

### 개발 플로우
1. `prisma/schema.prisma` 수정
2. 마이그레이션 파일 생성 및 로컬 DB 반영
   ```bash
   pnpm prisma migrate dev --name <변경_설명>
   ```
3. 생성된 `prisma/migrations/**` 폴더를 Git 커밋

### CI / 운영 배포
운영 컨테이너는 시작 스크립트에서 미적용 마이그레이션만 안전하게 적용합니다:
```bash
pnpm prisma migrate deploy && pnpm start:prod
```

### 요약
| 단계 | 명령 | 설명 |
|------|------|------|
| 개발 | `pnpm prisma migrate dev --name …` | 마이그레이션 생성 + 로컬 DB 적용 |
| CI   | 위 동일 명령 또는 스키마 검증 | 생성된 파일을 빌드 산출물에 포함 |
| 운영 | `pnpm prisma migrate deploy` | 미적용 마이그레이션을 DB 에 반영 |

> **주의**: 이미 적용된 마이그레이션을 수정·삭제하지 말고 **새 마이그레이션**을 추가하세요.

## 주요 스크립트
| 스크립트 | 설명 |
|-----------|-------|
| `pnpm start:dev` | 개발 서버 (Hot-reload) |
| `pnpm start:prod` | 프로덕션 빌드 실행 |
| `pnpm test` | 유닛 테스트 |
| `pnpm test:e2e` | E2E 테스트 |

## 데이터베이스 덤프 복원

Docker 환경에서 PostgreSQL 데이터베이스 덤프(.tar) 파일을 복원하는 방법입니다.

### 사전 준비
- 복원할 `.tar` 덤프 파일이 로컬에 준비되어 있어야 합니다
- `modufield-postgres` 컨테이너가 실행 중이어야 합니다
  ```bash
  docker ps | grep modufield-postgres
  ```

### 복원 절차

#### 1. 덤프 파일을 컨테이너로 복사
```bash
docker cp ./dump-modufield-202507171348.tar modufield-postgres:/tmp/backup.tar
```

#### 2. 데이터베이스 복원 실행
```bash
docker exec -t modufield-postgres pg_restore \
    -U postgres \
    -d modufield \
    --clean \
    --if-exists \
    -v \
    /tmp/backup.tar
```

**옵션 설명**:
- `-U postgres`: 데이터베이스 사용자
- `-d modufield`: 복원할 데이터베이스 이름
- `--clean`: 기존 객체를 삭제 후 복원 (덮어쓰기)
- `--if-exists`: 객체가 없을 경우 오류 무시
- `-v`: 상세 진행 상황 출력

#### 3. 임시 파일 정리 (선택)
```bash
docker exec modufield-postgres rm /tmp/backup.tar
```

#### 4. Prisma 마이그레이션 적용
덤프 파일 복원 시 스키마가 덤프 시점으로 되돌아가므로, 이후 추가된 마이그레이션을 반드시 적용해야 합니다:
```bash
docker exec modufield-backend-prod pnpm prisma migrate deploy
```

>이 단계를 생략하면 코드가 기대하는 스키마와 실제 DB 스키마가 불일치하여 런타임 에러가 발생할 수도 있음

### 복원 확인
터미널에서 테이블 목록을 확인하여 복원이 정상적으로 완료되었는지 검증합니다:
```bash
docker exec -it modufield-postgres psql -U postgres -d modufield -c "\dt"
```
