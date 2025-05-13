"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8 bg-[#0B0C2A]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* 헤더 */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-title text-4xl font-bold text-[#FFD700]">
            타로 스타일 가이드
          </h1>
          <p className="text-[#BFA2DB] text-lg">
            감성적이고 몽환적인 타로의 세계를 담은 디자인 시스템
          </p>
        </motion.div>

        <Tabs defaultValue="colors" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-[#1C1635]/50 border border-[#FFD700]/10">
            <TabsTrigger
              value="colors"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              컬러
            </TabsTrigger>
            <TabsTrigger
              value="typography"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              타이포그래피
            </TabsTrigger>
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              컴포넌트
            </TabsTrigger>
            <TabsTrigger
              value="spacing"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              여백 & 간격
            </TabsTrigger>
            <TabsTrigger
              value="backgrounds"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              배경
            </TabsTrigger>
            <TabsTrigger
              value="responsive"
              className="data-[state=active]:bg-[#FFD700] text-white data-[state=active]:text-[#0B0C2A]"
            >
              반응형
            </TabsTrigger>
          </TabsList>

          {/* 컬러 팔레트 */}
          <TabsContent value="colors" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  컬러 팔레트
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 메인 컬러 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">메인 컬러</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="h-24 bg-[#0B0C2A] rounded-lg border border-[#FFD700]/10" />
                      <p className="text-[#BFA2DB]">배경색</p>
                      <p className="text-sm text-[#BFA2DB]/70">#0B0C2A</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-24 bg-[#1C1635] rounded-lg border border-[#FFD700]/10" />
                      <p className="text-[#BFA2DB]">카드 배경</p>
                      <p className="text-sm text-[#BFA2DB]/70">#1C1635</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-24 bg-[#FFD700] rounded-lg border border-[#FFD700]/10" />
                      <p className="text-[#BFA2DB]">강조색</p>
                      <p className="text-sm text-[#BFA2DB]/70">#FFD700</p>
                    </div>
                  </div>
                </div>

                {/* 텍스트 컬러 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">텍스트 컬러</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="h-24 bg-[#FFD700] rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                        <p className="text-[#0B0C2A] font-medium">
                          강조 텍스트
                        </p>
                      </div>
                      <p className="text-[#BFA2DB]">강조 텍스트</p>
                      <p className="text-sm text-[#BFA2DB]/70">#FFD700</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-24 bg-[#BFA2DB] rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                        <p className="text-[#0B0C2A] font-medium">
                          일반 텍스트
                        </p>
                      </div>
                      <p className="text-[#BFA2DB]">일반 텍스트</p>
                      <p className="text-sm text-[#BFA2DB]/70">#BFA2DB</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-24 bg-[#BFA2DB]/50 rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                        <p className="text-[#0B0C2A] font-medium">
                          보조 텍스트
                        </p>
                      </div>
                      <p className="text-[#BFA2DB]">보조 텍스트</p>
                      <p className="text-sm text-[#BFA2DB]/70">#BFA2DB/50</p>
                    </div>
                  </div>
                </div>

                {/* 그라데이션 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">그라데이션</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-24 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg border border-[#FFD700]/10" />
                      <p className="text-[#BFA2DB]">메인 그라데이션</p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        from-[#FFD700] to-[#FFA500]
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-24 bg-gradient-to-r from-[#1C1635]/50 to-[#0B0C2A]/50 backdrop-blur-sm rounded-lg border border-[#FFD700]/10" />
                      <p className="text-[#BFA2DB]">배경 그라데이션</p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        from-[#1C1635]/50 to-[#0B0C2A]/50
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 타이포그래피 */}
          <TabsContent value="typography" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  타이포그래피
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 헤딩 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">헤딩</h3>
                  <div className="space-y-4">
                    <div>
                      <h1 className="font-title text-4xl font-bold text-[#FFD700]">
                        Heading 1
                      </h1>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-title text-4xl font-bold
                      </p>
                    </div>
                    <div>
                      <h2 className="font-title text-3xl font-medium text-[#FFD700]">
                        Heading 2
                      </h2>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-title text-3xl font-medium
                      </p>
                    </div>
                    <div>
                      <h3 className="font-title text-2xl font-medium text-[#FFD700]">
                        Heading 3
                      </h3>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-title text-2xl font-medium
                      </p>
                    </div>
                    <div>
                      <h4 className="font-title text-xl font-medium text-[#FFD700]">
                        Heading 4
                      </h4>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-title text-xl font-medium
                      </p>
                    </div>
                  </div>
                </div>

                {/* 본문 텍스트 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">본문 텍스트</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-lg text-[#BFA2DB]">
                        본문 텍스트 (Large)
                      </p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-body text-lg
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-base text-[#BFA2DB]">
                        본문 텍스트 (Base)
                      </p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-body text-base
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-sm text-[#BFA2DB]">
                        본문 텍스트 (Small)
                      </p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        font-body text-sm
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 컴포넌트 */}
          <TabsContent value="components" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  컴포넌트
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 버튼 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">버튼</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button className="bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFE566]">
                      기본 버튼
                    </Button>
                    <Button
                      variant="outline"
                      className="border-[#FFD700]/20 text-white"
                    >
                      아웃라인 버튼
                    </Button>
                    <Button disabled className="bg-[#FFD700]/50 text-[#0B0C2A]">
                      비활성화
                    </Button>
                  </div>
                </div>

                {/* 입력 필드 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">입력 필드</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[#BFA2DB]">라벨</Label>
                      <Input
                        placeholder="플레이스홀더 텍스트"
                        className="bg-[#1C1635]/50 border-[#FFD700]/20 text-white placeholder:text-[#BFA2DB]/50"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        className="border-[#FFD700]/20 data-[state=checked]:bg-[#FFD700] data-[state=checked]:text-[#0B0C2A]"
                      />
                      <Label
                        htmlFor="terms"
                        className="text-sm text-[#BFA2DB] cursor-pointer"
                      >
                        체크박스 라벨
                      </Label>
                    </div>
                  </div>
                </div>

                {/* 검색 필터 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">검색 필터</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BFA2DB]/50" />
                      <Input
                        placeholder="검색어를 입력하세요"
                        className="pl-10 bg-[#1C1635]/50 border-[#FFD700]/20 text-white placeholder:text-[#BFA2DB]/50"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["전체", "오늘의 운세", "연애", "진로", "건강"].map(
                        (category) => (
                          <Button
                            key={category}
                            variant="outline"
                            className="border-[#FFD700]/20 text-[#BFA2DB] hover:bg-[#FFD700]/10"
                          >
                            {category}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 페이지네이션 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">페이지네이션</h3>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className="text-[#BFA2DB] hover:bg-[#FFD700]/10"
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="bg-[#FFD700] text-[#0B0C2A]"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="text-[#BFA2DB] hover:bg-[#FFD700]/10"
                        >
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          className="text-[#BFA2DB] hover:bg-[#FFD700]/10"
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis className="text-[#BFA2DB]" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className="text-[#BFA2DB] hover:bg-[#FFD700]/10"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>

                {/* 카드 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">카드</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
                      <CardHeader>
                        <CardTitle className="text-xl font-medium text-[#FFD700]">
                          카드 제목
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#BFA2DB]">카드 내용</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
                      <CardHeader>
                        <CardTitle className="text-xl font-medium text-[#FFD700]">
                          카드 제목
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#BFA2DB]">카드 내용</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 여백 & 간격 */}
          <TabsContent value="spacing" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  여백 & 간격
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 여백 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">여백</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">p-4 (1rem, 16px)</p>
                    </div>
                    <div className="p-6 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">p-6 (1.5rem, 24px)</p>
                    </div>
                    <div className="p-8 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">p-8 (2rem, 32px)</p>
                    </div>
                  </div>
                </div>

                {/* 간격 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">간격</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <p className="text-[#BFA2DB]">gap-2 (0.5rem, 8px)</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <p className="text-[#BFA2DB]">gap-4 (1rem, 16px)</p>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <div className="w-8 h-8 bg-[#FFD700] rounded" />
                      <p className="text-[#BFA2DB]">gap-6 (1.5rem, 24px)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 배경 */}
          <TabsContent value="backgrounds" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  배경 스타일
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 기본 배경 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">기본 배경</h3>
                  <div className="h-48 bg-[#0B0C2A] rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                    <p className="text-[#BFA2DB]">bg-[#0B0C2A]</p>
                  </div>
                </div>

                {/* 카드 배경 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">카드 배경</h3>
                  <div className="h-48 bg-[#1C1635]/50 backdrop-blur-sm rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                    <p className="text-[#BFA2DB]">
                      bg-[#1C1635]/50 backdrop-blur-sm
                    </p>
                  </div>
                </div>

                {/* 그라데이션 배경 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">그라데이션 배경</h3>
                  <div className="h-48 bg-gradient-to-r from-[#1C1635]/50 to-[#0B0C2A]/50 backdrop-blur-sm rounded-lg border border-[#FFD700]/20 flex items-center justify-center">
                    <p className="text-[#BFA2DB]">
                      bg-gradient-to-r from-[#1C1635]/50 to-[#0B0C2A]/50
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 반응형 */}
          <TabsContent value="responsive" className="space-y-8">
            <Card className="bg-[#1C1635]/50 border-[#FFD700]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-medium text-[#FFD700]">
                  반응형 기준
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 브레이크포인트 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">브레이크포인트</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">모바일: ~ 640px</p>
                      <p className="text-sm text-[#BFA2DB]/70">sm: 640px</p>
                    </div>
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">태블릿: 641px ~ 1024px</p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        md: 768px, lg: 1024px
                      </p>
                    </div>
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">데스크톱: 1025px ~</p>
                      <p className="text-sm text-[#BFA2DB]/70">
                        xl: 1280px, 2xl: 1536px
                      </p>
                    </div>
                  </div>
                </div>

                {/* 접근성 */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">접근성</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">시맨틱 HTML</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#BFA2DB]/70">
                        <li>
                          • header, nav, main, section, article, footer 사용
                        </li>
                        <li>• 적절한 heading 계층 구조 유지</li>
                        <li>• ARIA 레이블 및 역할 지정</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">키보드 접근성</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#BFA2DB]/70">
                        <li>• 포커스 가능한 요소에 시각적 표시</li>
                        <li>• 논리적인 탭 순서</li>
                        <li>• 키보드 단축키 지원</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="space-y-4">
                  <h3 className="text-xl text-[#BFA2DB]">SEO</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">메타 정보</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#BFA2DB]/70">
                        <li>• title, description, keywords 설정</li>
                        <li>• Open Graph 태그 사용</li>
                        <li>• 구조화된 데이터 마크업</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[#1C1635] border border-[#FFD700]/20 rounded-lg">
                      <p className="text-[#BFA2DB]">성능 최적화</p>
                      <ul className="mt-2 space-y-2 text-sm text-[#BFA2DB]/70">
                        <li>• 이미지 최적화</li>
                        <li>• 코드 스플리팅</li>
                        <li>• 캐싱 전략</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
