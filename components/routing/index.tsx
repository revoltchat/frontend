/**
 * We re-export everything to prevent us importing @solidjs/router
 * more than once in the project, this can cause some weird behaviour
 * where it can't find the context. This is a side-effect of working
 * in a monorepo. Ideally, this should be done any time we import
 * a new library that is used in multiple components.
 */
export {
  Link,
  Navigate,
  Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "@solidjs/router";
