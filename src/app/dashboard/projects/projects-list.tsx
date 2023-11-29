import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { MoreHorizontalIcon } from 'lucide-react';
import Menu from './menu';
import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { formatDistance } from 'date-fns';
import { Project } from '@/types/project';

export default function ProjectsList({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((project, i) => {
        const dateWithDistance = formatDistance(
          new Date(project.created_datetime),
          new Date(),
          {
            includeSeconds: true,
            addSuffix: true,
          }
        );
        return (
          <Card key={i}>
            <CardHeader className="space-y-0">
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <CardTitle>{project.name}</CardTitle>
                  </Link>

                  <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </div>

                <CardDescription>
                  Add a nice description here. @Mega add a field in the database
                  please.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <div>{dateWithDistance}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
