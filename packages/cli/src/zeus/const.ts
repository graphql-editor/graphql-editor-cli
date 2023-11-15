/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Project:{
		members:{

		},
		sources:{

		}
	},
	PredictCheckoutInput:{

	},
	Decimal: `scalar.Decimal` as const,
	StripeCheckoutDataInput:{

	},
	UpdateProject:{

	},
	ChangeSubscriptionInput:{

	},
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	Mutation:{
		changePassword:{

		},
		changeSubscription:{
			in:"ChangeSubscriptionInput"
		},
		consumeInviteToken:{

		},
		createTeam:{

		},
		createUser:{

		},
		sync:{

		},
		team:{

		},
		updateSources:{
			sources:"NewSource"
		}
	},
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	VatInput:{

	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	TeamEnabledFailureStatus: "enum" as const,
	Query:{
		checkoutData:{
			data:"CheckoutDataInput"
		},
		exchangeServiceAccountKey:{

		},
		fileServerCredentials:{

		},
		findProjects:{

		},
		findProjectsByTag:{

		},
		generateStripeBillingPortal:{

		},
		getAiRespond:{

		},
		getNamespace:{

		},
		getProject:{

		},
		getTeam:{

		},
		getUser:{

		},
		listProjects:{
			sort:"ProjectsSortInput"
		},
		myTeams:{

		},
		predictCheckout:{
			data:"PredictCheckoutInput"
		},
		stripePaymentLink:{
			data:"StripeCheckoutDataInput"
		}
	},
	Role: "enum" as const,
	NewSource:{

	},
	CustomerInput:{

	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	RenameFileInput:{

	},
	PaymentDate: `scalar.PaymentDate` as const,
	SortOrder: "enum" as const,
	AccountType: "enum" as const,
	TeamOps:{
		addMember:{
			role:"Role"
		},
		createProject:{

		},
		createServiceAccount:{
			input:"CreateServiceAccountInput"
		},
		createServiceAccountApiKey:{

		},
		inviteToken:{
			role:"Role"
		},
		member:{

		},
		members:{

		},
		project:{

		},
		removeServiceAccount:{

		},
		removeServiceAccountApiKey:{

		},
		removeToken:{

		}
	},
	ProjectOps:{
		addMember:{
			role:"Role"
		},
		createTemporaryFile:{

		},
		removeSources:{

		},
		renameSources:{
			files:"RenameFileInput"
		},
		update:{
			in:"UpdateProject"
		}
	},
	CreateServiceAccountInput:{

	},
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	ProjectsSortInput:{
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder",
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder"
	}
}

export const ReturnTypes: Record<string,any> = {
	Header:{
		key:"String",
		value:"String"
	},
	Project:{
		createdAt:"RFC3339Date",
		description:"String",
		enabled:"Boolean",
		endpoint:"Endpoint",
		id:"ID",
		members:"MemberConnection",
		mocked:"Boolean",
		name:"String",
		owner:"User",
		public:"Boolean",
		slug:"String",
		sources:"FakerSourceConnection",
		tags:"String",
		team:"Team",
		updatedAt:"RFC3339Date",
		upstream:"String"
	},
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
	},
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	Decimal: `scalar.Decimal` as const,
	Team:{
		enabled:"TeamEnabled",
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
	},
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	Endpoint:{
		uri:"String"
	},
	Mutation:{
		changePassword:"Boolean",
		changeSubscription:"Boolean",
		consumeInviteToken:"Boolean",
		createTeam:"TeamOps",
		createUser:"User",
		deleteAccount:"Boolean",
		resendVerificationEmail:"Boolean",
		sync:"Boolean",
		team:"TeamOps",
		updateSources:"SourceUploadInfo"
	},
	User:{
		accountType:"AccountType",
		consentGiven:"Boolean",
		consentTimestamp:"Int",
		id:"ID",
		namespace:"Namespace",
		stripeCustomerId:"ID",
		subscriptions:"SubscriptionConnection",
		username:"String"
	},
	RFC3339Date: `scalar.RFC3339Date` as const,
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		generateStripeBillingPortal:"String",
		getAiRespond:"String",
		getNamespace:"Namespace",
		getProject:"Project",
		getTeam:"Team",
		getUser:"User",
		listProjects:"ProjectConnection",
		myTeams:"TeamConnection",
		payments:"Payment",
		predictCheckout:"PredictCheckout",
		stripePaymentLink:"String"
	},
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	},
	InviteToken:{
		createdAt:"String",
		domain:"String",
		expiration:"String",
		name:"String",
		removed:"Boolean",
		role:"Role",
		token:"String"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
	},
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	TeamEnabled:{
		enabled:"Boolean",
		status:"TeamEnabledFailureStatus"
	},
	TeamOps:{
		addMember:"Member",
		createProject:"Project",
		createServiceAccount:"ServiceAccount",
		createServiceAccountApiKey:"ServiceAccountApiKey",
		delete:"Boolean",
		id:"ID",
		inviteToken:"String",
		member:"MemberOps",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		project:"ProjectOps",
		removeServiceAccount:"Boolean",
		removeServiceAccountApiKey:"Boolean",
		removeToken:"String"
	},
	ProjectOps:{
		addMember:"Member",
		createTemporaryFile:"TemporaryFile",
		delete:"Boolean",
		deployToFaker:"Boolean",
		removeSources:"Boolean",
		renameSources:"Boolean",
		update:"Boolean"
	},
	Subscription:{
		cancelURL:"String",
		expiration:"String",
		quantity:"Int",
		seats:"UserConnection",
		status:"String",
		subscriptionID:"Int",
		subscriptionPlanID:"Int",
		updateURL:"String"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}