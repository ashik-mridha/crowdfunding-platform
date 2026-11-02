"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Description,
  FieldError,
  Input,
  Label,
  Modal,
  Pagination,
  ProgressBar,
  Skeleton,
  Table,
  TextField,
  toast,
} from "@heroui/react";
import { SiteNavbar } from "@/components/layout/SiteNavbar";
import { SiteFooter } from "@/components/layout/SiteFooter";

const rows = [
  { id: 1, campaign: "Solar Water Pump for Rahim Village", amount: 500, status: "approved" },
  { id: 2, campaign: "Community Health Clinic Fund", amount: 300, status: "pending" },
  { id: 3, campaign: "Books for Every Child", amount: 450, status: "rejected" },
];
const statusColor = { approved: "success", pending: "warning", rejected: "danger" };

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-4 py-12 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-extrabold">Fundora design system</h1>
          <p className="text-foreground/70">
            A review page for the building blocks used across the app. Toggle the theme in the navbar.
          </p>
        </header>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button isDisabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="email" type="email" isRequired>
              <Label>Email</Label>
              <Input placeholder="you@example.com" />
              <Description>We never share your email address.</Description>
            </TextField>
            <TextField name="amount" type="number" isInvalid>
              <Label>Contribution amount</Label>
              <Input placeholder="50" />
              <FieldError>Amount must be at least 10 credits.</FieldError>
            </TextField>
          </div>
        </Section>

        <Section title="Cards and progress">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <Card.Header>
                <Card.Title>Clean Water for All</Card.Title>
                <Card.Description>Community - ends in 18 days</Card.Description>
              </Card.Header>
              <Card.Content className="space-y-3">
                <ProgressBar aria-label="Funding progress" value={66}>
                  <ProgressBar.Track>
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
                <p className="text-sm text-foreground/70">6,580 of 10,000 credits raised</p>
              </Card.Content>
              <Card.Footer>
                <Button size="sm">View Details</Button>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Chips</Card.Title>
              </Card.Header>
              <Card.Content className="flex flex-wrap gap-2">
                <Chip color="success">Approved</Chip>
                <Chip color="warning">Pending</Chip>
                <Chip color="danger">Rejected</Chip>
                <Chip color="default">Technology</Chip>
              </Card.Content>
            </Card>
          </div>
        </Section>

        <Section title="Table, pagination and modal">
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Sample contributions" className="min-w-[560px]">
                <Table.Header>
                  <Table.Column isRowHeader>Campaign</Table.Column>
                  <Table.Column>Amount</Table.Column>
                  <Table.Column>Status</Table.Column>
                </Table.Header>
                <Table.Body>
                  {rows.map((r) => (
                    <Table.Row key={r.id} id={r.id}>
                      <Table.Cell>{r.campaign}</Table.Cell>
                      <Table.Cell>{r.amount} credits</Table.Cell>
                      <Table.Cell>
                        <Chip size="sm" color={statusColor[r.status]}>
                          {r.status}
                        </Chip>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous isDisabled={page === 1} onPress={() => setPage((p) => p - 1)}>
                  <Pagination.PreviousIcon />
                  Prev
                </Pagination.Previous>
              </Pagination.Item>
              {[1, 2, 3].map((n) => (
                <Pagination.Item key={n}>
                  <Pagination.Link isActive={page === n} onPress={() => setPage(n)}>
                    {n}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next isDisabled={page === 3} onPress={() => setPage((p) => p + 1)}>
                  Next
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>

          <div className="flex flex-wrap gap-3">
            <Modal>
              <Button variant="secondary">Open modal</Button>
              <Modal.Backdrop>
                <Modal.Container>
                  <Modal.Dialog className="sm:max-w-md">
                    <Modal.CloseTrigger />
                    <Modal.Header>
                      <Modal.Heading>Approve this contribution?</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Approving adds 500 credits to your campaign total and notifies the supporter.</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button slot="close" variant="secondary">
                        Cancel
                      </Button>
                      <Button slot="close">Approve</Button>
                    </Modal.Footer>
                  </Modal.Dialog>
                </Modal.Container>
              </Modal.Backdrop>
            </Modal>
            <Button variant="outline" onPress={() => toast.success("Contribution approved")}>
              Show toast
            </Button>
          </div>
        </Section>

        <Section title="Skeleton">
          <Card>
            <Card.Content className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-4 w-1/3 rounded" />
            </Card.Content>
          </Card>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
